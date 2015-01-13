/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi, Zakhar Tomchenko
 * @version: $Id: DesignerCanvasView.js 1008 2014-11-12 12:32:51Z ktsaregradskyi $
 */

define(function(require, exports, module) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        i18n = require('bundle!CommonBundle'),
        OverlayDialog = require("./DashboardOverlayDialog"),
        ViewerCanvasView = require("../viewer/ViewerCanvasView"),
        AdhocDesignerIframeView = require("./AdhocDesignerIframeView"),
        DashboardResourceModel = require("dashboard/model/DashboardResourceModel"),
        RepositoryResourceModel = require("common/model/RepositoryResourceModel"),
        DashletModel = require("dashboard/model/component/DashletModel"),
        dashboardComponentModelFactory = require("dashboard/factory/dashboardComponentModelFactory"),
        AddDashboardComponentDialogController = require("dashboard/view/designer/AddDashboardComponentDialogController"),
        dashboardComponentViewFactory = require("../../factory/dashboardComponentViewFactory"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        dashboardResourceReferenceTypes = require("dashboard/enum/dashboardResourceReferenceTypes"),
        repositoryResourceTypes = require("common/enum/repositoryResourceTypes"),
        dashboardMessageBus = require("../../dashboardMessageBus"),
        dashboardMessageBusEvents = require("../../enum/dashboardMessageBusEvents"),
        adHocToDashboardTypeMapper = require("dashboard/mapper/adHocToDashboardTypeMapper"),
        log = require("logger").register(module);

    require("jquery.ui");

    return ViewerCanvasView.extend({
        isDesigner: true,

        addComponentByTypeHandlerMap: function () {
            var handlerMap = {};

            handlerMap[dashboardComponentTypes.WEB_PAGE_VIEW] = this._addWebPageView;
            handlerMap[dashboardComponentTypes.FREE_TEXT] = this._addFreeText;
            handlerMap[dashboardComponentTypes.CHART] = this._addNewVisualization;
            handlerMap[dashboardComponentTypes.CROSSTAB] = this._addNewVisualization;
            handlerMap[dashboardComponentTypes.TABLE] = this._addNewVisualization;
            handlerMap[dashboardComponentTypes.FILTER_GROUP] = this._addInputControl;

            return handlerMap;
        },

        initialize: function(options){
            _.bindAll(this, "_addWebPageView", "_addFreeText", "_addNewVisualization", "_addDefaultComponentType", "_addInputControl");

            ViewerCanvasView.prototype.initialize.apply(this, arguments);

            this.strategy = options.strategy;

            this._initGrid();
            this.strategy.initVisualHelpers(this.$el);

            this.$el.droppable({
                accept: ".draggable",
                activeClass: "ui-dropping",
                tolerance: "pointer",
                drop: _.bind(this._onCanvasDrop, this)
            });

            _.bindAll(this, "_onGlobalMousedown", "_onGlobalKeydown");

            $(document).on("mousedown", this._onGlobalMousedown);
            $(document).on("keydown", this._onGlobalKeydown);

            this.$overlay = new OverlayDialog({
                content: i18n["dialog.overlay.loading"]
            });
        },

        enableAutoRefresh: function() {},

        addComponentView: function(componentModel) {
            var componentView = ViewerCanvasView.prototype.addComponentView.call(this, componentModel);

            if (componentView) {
                this.listenTo(componentView, "delete", this.removeComponent);
            }

            return componentView;
        },

        _onCanvasDrop: function(event, ui) {
            // here we prevent dropping items on elements outside of canvas
            var $originalTarget = $(event.originalEvent.target);

            if ($originalTarget.hasClass("dashboardCanvas") || $originalTarget.parents(".dashboardCanvas").length) {
                var self = this,
                    componentObj = ui.helper.data("data");

                if (!componentObj.componentId) {
                    // prevent adding the same Input Control twice
                    if (componentObj.resourceType === repositoryResourceTypes.INPUT_CONTROL &&
                        (this.model.currentFoundation.components.findWhere({ resource: componentObj.uri }) ||
                            this.model.currentFoundation.components.find(function (component) {
                                return component.get("type") === repositoryResourceTypes.INPUT_CONTROL &&
                                    component.getOwnerUri() === componentObj.ownerResourceId &&
                                    component.getOwnerParameterName() === componentObj.id;
                            }))) {
                        return;
                    }

                    this.$overlay.open();

                    this.addComponent(componentObj)
                        .done(function (componentModel) {
                            if (!(componentModel.get("type") === dashboardComponentTypes.FILTER_GROUP && componentModel.getChildren().length >= 2)) {
                                self.strategy.onDashletDrop(componentModel, event, ui, self.$el);
                            }

                            $.when(componentModel.paramsDfd || {}).always(function () {
                                self.$overlay.close();
                            }).done(function(){
                                dashboardMessageBus.trigger(dashboardMessageBusEvents.SAVE_DASHBOARD_STATE);
                            });
                        });
                } else {
                    var component = this.model.currentFoundation.components.get(componentObj.componentId),
                    // TODO: revise this after refactoring MoveHelper
                    // store current position values to be able then to check if they changed
                    // is done because drop action corrupts component position
                        position = component.getPositionObject();

                    this.strategy.onDashletDrop(component, event, ui, this.$el);

                    if (!_.isEqual(component.getPositionObject(), position)) {
                        dashboardMessageBus.trigger(dashboardMessageBusEvents.SAVE_DASHBOARD_STATE);
                    }
                }
            }
        },

        _onGlobalMousedown: function(e) {
            var components = this.model.currentFoundation.components,
                selectedComponent = components.getSelectedComponent(),
                componentId;

            if (selectedComponent && (componentId = selectedComponent.get("id")) && selectedComponent.isVisible()) {
                var $selectedComponentEl = this.getComponentViewByComponentId(componentId).$el;
                var selectedComponentOffset = $selectedComponentEl.offset();

                var xIntersection = e.pageX - selectedComponentOffset.left;
                var yIntersection = e.pageY - selectedComponentOffset.top;

                if (!(xIntersection > 0 &&
                    xIntersection < $selectedComponentEl.width() &&
                    yIntersection > 0 &&
                    yIntersection < $selectedComponentEl.height()) && !$(e.target).closest("." + dashboardSettings.DASHLET_PROPERTIES_DIALOG_CLASS).length
                    && !$(e.target).closest("." + dashboardSettings.DELETE_CONFIRMATION_DIALOG_CLASS).length
                    && !$(e.target).closest("." + dashboardSettings.CONTEXT_MENU_CLASS).length
                    ) {
                    components.selectComponent(undefined);
                }
            }
        },

        _onGlobalKeydown: function(e) {
            if (e.which === 46 && !$(e.target).closest("." + dashboardSettings.DASHLET_PROPERTIES_DIALOG_CLASS).length
                && !$(e.target).closest("." + dashboardSettings.SAVE_AS_DIALOG_CLASS).length
                && !$(e.target).find("." + dashboardSettings.SAVE_AS_DIALOG_CLASS + ":visible").length) {
                this.removeComponent(this.model.currentFoundation.components.getSelectedComponent());
            }
        },

        _initAddComponentDialogEvents: function(componentModel, dfd, callback){
            var self = this;

            this.listenTo(this.addComponentDialogController.dialog, "button:ok", function() {
                callback && callback.call(self, componentModel);
                self.closeAddComponentDialog();
                self.model.currentFoundation.components.add(componentModel);
                self.model.currentFoundation.components.selectComponent(componentModel);
                dfd.resolve(componentModel);
            });

            this.listenTo(this.addComponentDialogController.dialog, "button:cancel", function() {
                self.closeAddComponentDialog();
                dfd.reject(componentModel);
            });

        },

        addComponent: function(componentObj) {
            var dashboardResource,
                contextPath = this.model.contextPath,
                componentsCollection = this.model.currentFoundation.components,
                componentModel,
                dfd = $.Deferred();

            if (componentObj.resourceType === repositoryResourceTypes.INPUT_CONTROL) {
                var filterGroup = componentsCollection.findWhere({ type: dashboardComponentTypes.FILTER_GROUP });

                componentModel = filterGroup || dashboardComponentModelFactory({
                    type: dashboardComponentTypes.FILTER_GROUP,
                    name: "Filter Group"
                }, {
                    collection: componentsCollection
                });
            } else {
                if (componentObj.uri && componentObj.resourceType) {
                    dashboardResource = this.model.resources.get(componentObj.uri);

                    if (!dashboardResource) {
                        dashboardResource = DashboardResourceModel.createDashboardResource(componentObj, contextPath);
                    }
                }

                componentModel = dashboardComponentModelFactory(componentObj, {resource: dashboardResource, collection: componentsCollection}, {createComponentObj: true});
            }

            //Getting handler for adding component from a map or use default one.
            var addSpecificComponentHandler =
                this.addComponentByTypeHandlerMap()[componentModel.get("type")]
                || this._addDefaultComponentType;

            addSpecificComponentHandler(componentModel, dfd, componentObj);

            return dfd.promise();
        },

        addInputControlToFilterGroup: function(componentObj, filterGroupComponentId) {
            var componentsCollection = this.model.currentFoundation.components;

            if (componentsCollection.findWhere({ resource: componentObj.uri })) {
                return;
            }

            var dashboardResource;

            if (componentObj.uri && componentObj.resourceType) {
                if (!this.model.resources.get(componentObj.ownerResourceId)){
                    this.model.resources.each(function(resource){
                        (resource.resource.get("uri") === componentObj.ownerResourceId) && (componentObj.ownerResourceId = resource.get("name"));
                    });
                }

                dashboardResource = this.model.resources.get(componentObj.uri);

                if (!dashboardResource) {
                    dashboardResource = DashboardResourceModel.createDashboardResource(componentObj, this.model.contextPath);
                }
            }

            var filterGroupComponentModel = componentsCollection.get(filterGroupComponentId),
                inputControlsInFilterGroup = filterGroupComponentModel.getChildren(),
                maxIndexInFilterGroup = inputControlsInFilterGroup.length
                    ? Math.max.apply(null, _.map(inputControlsInFilterGroup, function(model) { return model.get("position"); })) || 0
                    : 0,
                inputControlComponentModel = dashboardComponentModelFactory(componentObj, {
                    resource: dashboardResource,
                    collection: componentsCollection
                }, {
                    createComponentObj: true
                });

            inputControlComponentModel.set({
                "ownerResourceId": componentObj.ownerResourceId,
                "ownerResourceParameterName": componentObj.ownerResourceParameterName,
                "masterDependencies": componentObj.masterDependencies,
                "fullCollectionRequired": componentObj.mandatory && !!componentObj.masterDependencies.length,
                "parentId": filterGroupComponentId,
                "position": maxIndexInFilterGroup + 1
            });

            return componentsCollection.add(inputControlComponentModel);
        },

        openAddComponentDialog: function (componentModel) {
            this.$overlay.close();

            this.addComponentDialogController = new AddDashboardComponentDialogController(componentModel);
            this.addComponentDialogController.dialog.open();
        },

        closeAddComponentDialog: function() {
            this.stopListening(this.addComponentDialogController.dialog);
            this.addComponentDialogController.dialog.close();
            this.addComponentDialogController.remove();
        },

        openAdhocDesignerIframe: function(componentModel) {
            this.adhocDesigner && this.removeAdhocDesignerIframe();
            this.adhocDesigner = new AdhocDesignerIframeView({ model: componentModel });
            this.adhocDesigner.render();
        },

        removeAdhocDesignerIframe: function() {
            this.stopListening(this.adhocDesigner);
            this.adhocDesigner.remove();
        },

        hideAdhocDesignerIframe: function(){
            this.stopListening(this.adhocDesigner);
            this.adhocDesigner.hide();
            this.adhocDesigner.removeSubComponents();
            this.adhocDesigner.detachEvents();
        },

        remove: function() {
            try {
                this.$el.droppable("destroy");
                this.addComponentDialogController && this.addComponentDialogController.remove();
                this.adhocDesigner && this.adhocDesigner.remove();
            } catch (e) {
                // destroyed already, skip
                log.debug(e);
            }

            this.$overlay.remove();

            $(document).off("mousedown", this._onGlobalMousedown);
            $(document).off("keydown", this._onGlobalKeydown);

            ViewerCanvasView.prototype.remove.apply(this, arguments);
        },

        removeComponent: function(componentModel) {
            if (!componentModel) {
                return;
            }

            this.model.currentFoundation.components.selectComponent(undefined);
            this.model.currentFoundation.components.remove(componentModel);

            dashboardMessageBus.trigger(dashboardMessageBusEvents.SAVE_DASHBOARD_STATE);

            // TODO: check if this is really needed
            if (componentModel.get("type") === dashboardComponentTypes.INPUT_CONTROL) {
                var filterDashlet = this.getComponentViewByComponentId(componentModel.get("parentId"));

                filterDashlet && filterDashlet.refreshFilterGroup();

                var dashletModel = this.model.currentFoundation.components.findWhere({resource: componentModel.get("ownerResourceId")});

                //TODO: Refresh dashlet content in a more acceptable way.
                this.getComponentViewByComponentId(dashletModel.id).render();
            }
        },

        _initGrid: function() {
            var $grid = $('<div>').addClass('grid').hide(),
                i, pos;

            for (i = 1; i < dashboardSettings.GRID_WIDTH; i++) {
                pos = this.strategy.cellToCoord(i, 0);

                $('<div>').appendTo($grid).css({
                    width: '1px',
                    height: '100%',
                    left: pos.x + '%'
                });
            }

            for (i = 1; i < dashboardSettings.GRID_HEIGHT; i++) {
                pos = this.strategy.cellToCoord(0, i);

                $('<div>').appendTo($grid).css({
                    width: '100%',
                    height: '1px',
                    top: pos.y + '%'
                });
            }

            this.$el.append($grid);
        },

        //Different component type adding handlers

        _addWebPageView: function(componentModel, dfd) {
            this.openAddComponentDialog(componentModel);

            this.addComponentDialogController.dialog.disableButton("ok");

            this._initAddComponentDialogEvents(componentModel, dfd, function(componentModel) {
                componentModel.set("name", componentModel.generateName(componentModel.get("url")));
            });
        },

        _addFreeText: function(componentModel, dfd) {
            this.openAddComponentDialog(componentModel);

            this._initAddComponentDialogEvents(componentModel, dfd);
        },

        _addNewVisualization: function(componentModel, dfd) {
            var self = this,
                contextPath = this.model.contextPath,
                componentsCollection = this.model.currentFoundation.components;

            this.$overlay.close();

            this.openAdhocDesignerIframe(componentModel);

            this.listenTo(this.adhocDesigner, "close", function() {
                self.removeAdhocDesignerIframe();
                dfd.reject(componentModel);
            });

            this.listenTo(this.adhocDesigner, "save", function(designerIframe, resource) {
                self.hideAdhocDesignerIframe();
                // we should fix Ad Hoc View Type for Dashboard
                resource.type = adHocToDashboardTypeMapper(resource.type);
                resource.resourceType = repositoryResourceTypes.ADHOC_DATA_VIEW;

                var dashboardResource = DashboardResourceModel.createDashboardResource(resource, contextPath);
                dashboardResource.temporary = true;

                var componentModel = dashboardComponentModelFactory(
                    resource,
                    {resource: dashboardResource, collection: componentsCollection},
                    {createComponentObj: true});

                componentsCollection.add(componentModel);
                componentsCollection.selectComponent(componentModel);

                dfd.resolve(componentModel);
            });
        },

        _addInputControl: function(filterGroupModel, dfd, controlComponentObj){
            var self = this,
                componentsCollection = this.model.currentFoundation.components,
                finishAdd = function(){
                    var filterComponentModel = self.addInputControlToFilterGroup(controlComponentObj, filterGroupModel.get("id"));

                    filterComponentModel && componentsCollection.selectComponent(filterComponentModel);
                    filterComponentModel && filterComponentModel.set("label", filterComponentModel.get("name"));

                    dfd.resolve(filterGroupModel);
                }

            if (componentsCollection.indexOf(filterGroupModel) === -1) {
                componentsCollection.add(filterGroupModel);
            }

            if (controlComponentObj.ownerResourceId + "_files/" + controlComponentObj.ownerResourceParameterName == controlComponentObj.uri){
                // this is local resource of report, which means, that it must be copied to the dashboard resources
                var controlResource = new RepositoryResourceModel({ uri: controlComponentObj.uri }, { contextPath: self.model.contextPath });

                controlResource.fetch({ expanded: true }).done(function() {
                    var resourceModel = new DashboardResourceModel({}, { contextPath: self.model.contextPath }),
                        resourceObj = {},
                        uri = controlResource.get("uri");

                    controlResource.unset("uri");
                    controlResource.set("label", self._generateControlId(controlComponentObj.id));

                    replaceGlobalResourceWithRef(controlResource.get("dataType"), uri, "dataTypeReference");
                    replaceGlobalResourceWithRef(controlResource.get("listOfValues"), uri, "listOfValuesReference");

                    var queryResource = replaceGlobalResourceWithRef(controlResource.get("query"), uri, "queryReference");
                    queryResource && replaceGlobalResourceWithRef(queryResource.dataSource, uri, "dataSourceReference");

                    stripVersion(controlResource);

                    resourceObj[dashboardResourceReferenceTypes.INPUT_CONTROL] = controlResource.attributes;

                    resourceModel.set({
                        "name": uri,
                        "type": dashboardComponentTypes.INPUT_CONTROL,
                        "resource": resourceObj
                    });

                    resourceModel.resource.resource = controlResource;

                    self.model.resources.add(resourceModel);

                    finishAdd();
                }).fail(_.bind(dfd.reject, dfd));
            } else {
                finishAdd();
            }
        },

        _addDefaultComponentType: function(componentModel, dfd, componentObj) {
            var componentsCollection = this.model.currentFoundation.components;

            if (componentsCollection.indexOf(componentModel) === -1) {
                componentsCollection.add(componentModel);
            }

            componentsCollection.selectComponent(componentModel);

            dfd.resolve(componentModel);
        },

        _generateControlId: function(base){
            var index = 2, self = this;

            if (labelAvailable(base)){
                return base;
            }

            if (/.*_\d+$/.match(base)){
                var underscore = base.lastIndexOf("_");
                index = +base.substring(underscore + 1) + 1;
                base = base.substring(0, underscore);
            }


            function labelAvailable(base){
                return !self.model.currentFoundation.components.find(function(component){
                    return component.resource && component.resource.resource.get("label") === base;
                })
            }

            function generateId(base, index) {
                var label = base + "_" + index;
                if (labelAvailable(label)) {
                    return label;
                }
                else {
                    return generateId(base, index + 1);
                }
            }

            return generateId(base, index);
        }
    });

    function stripVersion(resourceModel){
        resourceModel.unset("version");

        delVersion(resourceModel.attributes);

        function delVersion(obj){
            delete obj.version;

            _.each(_.keys(obj), function(key){
                _.isObject(obj[key]) && delVersion(obj[key]);
            });
        }
    }

    /**
     * Replace resource with reference, if this resource will NOT be a local resource for the Parent resource
     *
     * @param resourceWrapper Resource wrapper object
     * @param uri Parent resource URI
     * @param referenceName The name of the reference resource object property
     * @returns {*}
     */
    function replaceGlobalResourceWithRef(resourceWrapper, uri, referenceName) {
        if (!_.isObject(resourceWrapper)) {
            return resourceWrapper;
        }
        var localResKey = _.keys(resourceWrapper)[0],
            resource = resourceWrapper[localResKey];

        if (!isLocalResource(resource, uri)) {
            resource = resourceWrapper[referenceName] = _.pick(resource, "uri");
            delete resourceWrapper[localResKey];
        }
        return resource;
    }

    function isLocalResource(resource, parentResourceUri) {
        return (resource.uri || "").indexOf(parentResourceUri) === 0;
    }

});