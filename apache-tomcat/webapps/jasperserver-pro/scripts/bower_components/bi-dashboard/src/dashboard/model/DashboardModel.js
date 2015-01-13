/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Sergii Kylypko, Kostiantyn Tsaregradskyi
 * @version: $Id: DashboardModel.js 1027 2014-11-14 15:01:59Z ztomchenco $
 */

define(function(require){
    "use strict";

    var ResourceModel = require("common/model/RepositoryResourceModel"),
        DashboardFoundationCollection = require("dashboard/collection/DashboardFoundationCollection"),
        DashboardResourceCollection = require("dashboard/collection/DashboardResourceCollection"),
        DashboardResourceModel = require("./DashboardResourceModel"),
        DashboardWiringModel = require("./DashboardWiringModel"),
        DashboardFoundationModel = require("dashboard/model/DashboardFoundationModel"),
        dashboardComponentModelFactory = require("../factory/dashboardComponentModelFactory"),
        PropertiesDashboardComponentModel = require("./component/PropertiesDashboardComponentModel"),
        DashboardComponentCollection = require("../collection/DashboardComponentCollection"),
        ParametersCache = require("../collection/ReportsParametersCollection").instance,
        dashboardResourceTypes = require("dashboard/enum/dashboardResourceTypes"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        repositoryResourceTypes = require("common/enum/repositoryResourceTypes"),
        errorCodes = require("common/enum/errorCodes"),
        dashboardResourceReferenceTypes = require("dashboard/enum/dashboardResourceReferenceTypes"),
        ValidationError = require("common/validation/ValidationErrorMessage"),
        i18n = require("bundle!DashboardBundle"),
        json3 = require("json3"),
        $ = require("jquery"),
        _ = require("underscore");

    return ResourceModel.extend({
        type: repositoryResourceTypes.DASHBOARD,

        defaults: _.extend({}, ResourceModel.prototype.defaults, {
            label: i18n['dashboard.new.dashboard'],
            defaultFoundation: undefined,
            resources: undefined,
            foundations: undefined
        }),

        validation: _.extend({}, ResourceModel.prototype.validation, {
            label: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.label.required")
                },
                {
                    maxLength: ResourceModel.LABEL_MAX_LENGTH,
                    msg: new ValidationError("dashboard.error.label.maxLength", ResourceModel.LABEL_MAX_LENGTH)
                },
                {
                    doesNotContainSymbols: ResourceModel.LABEL_NOT_SUPPORTED_SYMBOLS,
                    msg: new ValidationError("dashboard.error.label.doesNotContainSymbols", ResourceModel.LABEL_NOT_SUPPORTED_SYMBOLS)
                }
            ],

            description: [
                {
                    required: false
                },
                {
                    maxLength: ResourceModel.DESCRIPTION_MAX_LENGTH,
                    msg: new ValidationError("dashboard.error.description.maxLength", ResourceModel.DESCRIPTION_MAX_LENGTH)
                },
                {
                    doesNotContainSymbols: ResourceModel.DESCRIPTION_NOT_SUPPORTED_SYMBOLS,
                    msg: new ValidationError("dashboard.error.description.doesNotContainSymbols", ResourceModel.DESCRIPTION_NOT_SUPPORTED_SYMBOLS)
                }
            ],

            parentFolderUri: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.parentFolderUri.required")
                }
            ]
        }),

        initialize: function() {
            ResourceModel.prototype.initialize.apply(this, arguments);

            this.resources = new DashboardResourceCollection();
            this.foundations = new DashboardFoundationCollection();

            this.listenTo(this.foundations, "add", this._onFoundationAdd);
            this.listenTo(this.foundations, "addComponent", this._onComponentAdd);
            this.listenTo(this.foundations, "removeComponent", this._onComponentRemove);
            this.listenTo(this.foundations, "addComponent removeComponent moveComponent resizeComponent", this._onLayoutChange);
            this.listenTo(this.foundations, "changeProperties changedControlProperties", this._onComponentChange);
            this.listenTo(this.foundations, "changeWiring", this._onWiringChange);

            this.on("change:defaultFoundation", this._onDefaultFoundationChange);

            this._initDefaultFoundation();
        },

        resetToInitialCondition: function() {
            var currentFoundation = this.currentFoundation;
            this.set(_.omit(this.defaults, "defaultFoundation"));
            currentFoundation.wiring.set([]);
            // TODO: this should be done automatically in set([])
            currentFoundation.wiring.handlers = {};
            currentFoundation.components.set([]);
            currentFoundation.components.add(new PropertiesDashboardComponentModel());

            this.resources.set([
                this.resources.get(currentFoundation.get("wiring")),
                this.resources.get(currentFoundation.get("layout")),
                this.resources.get(currentFoundation.get("components"))
            ]);
        },

        fetch: function(options) {
            options || (options = {});

            _.defaults(options, { expanded: true });

            var origFetchDfd = ResourceModel.prototype.fetch.call(this, options),
                dfd = new $.Deferred(),
                self = this;

            origFetchDfd
                .done(function() {
                    // fake response from server if we requested repository resource with invalid type
                    if (self.type !== repositoryResourceTypes.DASHBOARD) {
                        var fakeXhrResponse = {
                            status: 400,
                            responseText: json3.stringify({
                                message: "Resource '" + self.get("uri") + "' is not of type '" +  repositoryResourceTypes.DASHBOARD + "'",
                                errorCode: errorCodes.INVALID_RESOURCE_TYPE,
                                parameters: [ self.type ]
                            })
                        };

                        self.set(_.omit(self.defaults, "defaultFoundation", "foundations", "resources"));

                        self.trigger("error", self, fakeXhrResponse);

                        dfd.reject(fakeXhrResponse);

                        return;
                    }

                    self.trigger("rawDataFetched", self);

                    self.updateResourceCollection();

                    var fileResourcesDfdArray = self.resources
                        .chain()
                        .filter(function(dashboardResource) { return dashboardResource.resource && dashboardResource.resource.fetchContent; })
                        .map(function(dashboardResource) { return dashboardResource.resource.fetchContent(); })
                        .value();

                    $.when
                        .apply($, fileResourcesDfdArray)
                        .done(function() {
                            self.trigger("resourcesDataFetched", self);
                            self.updateFoundationCollection();
                            self.currentFoundation.startLoadingSequence();
                            dfd.resolve();
                        });
                })
                .fail(dfd.reject);


            return dfd;
        },

        toJSON: function(useFullResource) {
            this.foundations.map(_.bind(this._onWiringChange, this, null));

            var json = ResourceModel.prototype.toJSON.apply(this, arguments);

            json.foundations = this.foundations.toJSON();
            json.resources = this.resources.toJSON(useFullResource);

            return json;
        },

        _initDefaultFoundation: function() {
            var foundation = this.foundations.addDefaultFoundation();
            foundation.components.add(new PropertiesDashboardComponentModel());
            this.set("defaultFoundation", this.foundations.getDefaultFoundation().get("id"));
        },

        _onDefaultFoundationChange: function() {
            if (this.currentFoundation !== this.foundations.get(this.get("defaultFoundation"))) {
                this.currentFoundation = this.foundations.get(this.get("defaultFoundation"));
            }
        },

        _onComponentAdd: function(componentModel, foundationModel) {
            var componentsResource = this.resources.get(foundationModel.get("components"));

            componentsResource.resource.setContent(foundationModel.components.toJSON());

            var resource = componentModel.resource;

            if (resource && !this.resources.get(resource.id)) {
                this.resources.add(resource);
            }
        },

        _onComponentChange: function(componentModel, foundationModel) {
            var componentsResource = this.resources.get(foundationModel.get("components"));

            componentsResource.resource.setContent(foundationModel.components.toJSON());
        },

        _onComponentRemove: function(componentModel, foundationModel) {
            var componentsResource = this.resources.get(foundationModel.get("components"));

            componentsResource.resource.setContent(foundationModel.components.toJSON());

            var resource = componentModel.resource,
                resourceIsUsed = false;

            if (resource) {
                // check if resource related to deleted component is used by other components
                this.foundations.forEach(function(foundation) {
                    foundation.components.forEach(function(component) {
                        if (component !== componentModel && component.resource === resource) {
                            resourceIsUsed = true;
                        }
                    });
                });

                if (!resourceIsUsed) {
                    this.resources.remove(resource);
                }
            }
        },

        _onLayoutChange: function(componentModel, foundationModel) {
            var layoutResource = this.resources.get(foundationModel.get("layout"));

            layoutResource.resource.setContent(foundationModel.components.toHTML());
        },

        _onWiringChange: function(componentModel, foundationModel) {
            var wiringResource = this.resources.get(foundationModel.get("wiring"));

            wiringResource.resource.setContent(foundationModel.wiring.toJSON());
        },

        _onFoundationAdd: function(model) {
            var componentsResourceObj = {};
            componentsResourceObj[dashboardResourceReferenceTypes.FILE] = {
                label: model.get("components")
            };

            var layoutResourceObj = {};
            layoutResourceObj[dashboardResourceReferenceTypes.FILE] = {
                label: model.get("layout")
            };

            var wiringResourceObj = {};
            wiringResourceObj[dashboardResourceReferenceTypes.FILE] = {
                label: model.get("wiring")
            };

            var componentsResourceModel = this.resources.add(new DashboardResourceModel({
                name: model.get("components"),
                type: dashboardResourceTypes.COMPONENTS,
                resource: componentsResourceObj
            }, { contextPath: this.contextPath }));

            componentsResourceModel.resource.setContent(model.components.toJSON());

            var layoutResourceModel = this.resources.add(new DashboardResourceModel({
                name: model.get("layout"),
                type: dashboardResourceTypes.LAYOUT,
                resource: layoutResourceObj
            }, { contextPath: this.contextPath }));

            layoutResourceModel.resource.setContent(model.components.toHTML());

            var wiringResourceModel = this.resources.add(new DashboardResourceModel({
                name: model.get("wiring"),
                type: dashboardResourceTypes.WIRING,
                resource: wiringResourceObj
            }, { contextPath: this.contextPath }));

            wiringResourceModel.resource.setContent(model.wiring.toJSON());
        },

        updateResourceCollection: function() {
            this.resources.set(this.get("resources"), { merge: true, remove: true, add: true });
        },

        updateFoundationCollection: function() {
            var self = this;

            this.foundations.set(this.get("foundations"), { merge: true, remove: true, add: true });

            this.foundations.forEach(function(foundationModel) {
                var componentsDashboardResource = self.resources.get(foundationModel.get("components")),
                    layoutDashboardResource = self.resources.get(foundationModel.get("layout")),
                    wiringDashboardResource = self.resources.get(foundationModel.get("wiring")),
                    components = new DashboardComponentCollection(),
                    wiringDashboardResourceContent;

                if (wiringDashboardResource && wiringDashboardResource.resource
                    && wiringDashboardResource.resource.content && _.isArray(wiringDashboardResource.resource.content)) {
                    wiringDashboardResourceContent = _.clone(wiringDashboardResource.resource.content);
                }

                if (componentsDashboardResource && componentsDashboardResource.resource
                    && componentsDashboardResource.resource.content && _.isArray(componentsDashboardResource.resource.content)) {

                    preloadValues(componentsDashboardResource.resource.content, self.resources.reduce(function (memo, resource) {
                        memo[resource.id] = resource.resource.get("uri");
                        return memo;
                    }, {}));

                    _.forEach(componentsDashboardResource.resource.content, function(componentObj) {
                        components.add(dashboardComponentModelFactory(componentObj, {
                            resource: self.resources.get(componentObj.resource),
                            collection: foundationModel.components
                        }));
                    });

                    if (layoutDashboardResource && layoutDashboardResource.resource) {
                        components.setPositionFromHtml(layoutDashboardResource.resource.content);
                    }

                    foundationModel.components.set(components.models, { merge: true, remove: true, add: true });
                }

                if (wiringDashboardResourceContent) {
                    foundationModel.wiring.set(_.map(wiringDashboardResourceContent, function(connectionObj){
                        return new DashboardWiringModel(_.omit(connectionObj, "consumers"), {
                            component: foundationModel.components.get(connectionObj.component),
                            consumers: connectionObj.consumers
                        });
                    }));

                    _.each(wiringDashboardResourceContent, function(connectionObj){
                        foundationModel.wiring.get(connectionObj.producer).consumers.set(connectionObj.consumers);
                    });
                }
            });
        },

        clone: function() {
            var clonedModel = new this.constructor();

            clonedModel.applyJsonState(this.toJSON(true));

            return clonedModel;
        },

        applyJsonState: function(fullJsonState) {
            var resourcesContent = {};

            _.each(fullJsonState.resources, function(resourceObj) {
                if ("file" in resourceObj.resource) {
                    resourcesContent[resourceObj.name] = resourceObj.resource.file.content;
                    delete resourceObj.resource.file.content;
                }
            });

            this.set(fullJsonState);

            // this is temporary solution
            _.each(fullJsonState.resources, function(resourceObj) {
                if (resourceObj.name in  resourcesContent) {
                    resourceObj.resource.file.content = resourcesContent[resourceObj.name];
                }
            });

            this.updateResourceCollection();

            // emulate result of fetchContent method
            this.resources.forEach(function(dashboardResource) {
                if (dashboardResource.get("name") in resourcesContent) {
                    dashboardResource.resource.set("content", resourcesContent[dashboardResource.get("name")]);
                }
            });

            this.updateFoundationCollection();
        }
    });

    function preloadValues(components, idToUriMap){
        var controls = _.where(components, {type: dashboardComponentTypes.INPUT_CONTROL}),
            controlGroups = _.reduce(controls, function(memo, control){
                (memo[control.ownerResourceId] || (memo[control.ownerResourceId] = [])).push(control);
                return memo;
            }, {});

        _.each(_.keys(controlGroups), function(key){
            ParametersCache.add({
                reportUri: idToUriMap[key]
            }, {
                full: !!_.findWhere(controlGroups[key], {fullCollectionRequired: true}),
                knownIds: _.pluck(controlGroups[key], "ownerResourceParameterName")
            });
        });
    }
});