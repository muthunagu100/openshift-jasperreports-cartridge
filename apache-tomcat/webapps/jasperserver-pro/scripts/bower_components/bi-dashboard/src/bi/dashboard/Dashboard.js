/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: Dashboard.js 965 2014-11-04 11:14:45Z sergey.prilukin $
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        json3 = require("json3"),
        log = require("logger").register(module),
        biComponentUtil = require("common/bi/component/util/biComponentUtil"),
        biComponentErrorFactory = require("common/bi/error/biComponentErrorFactory"),
        BiComponent = require("common/bi/component/BiComponent"),
        DashboardBiComponentStateModel = require("./model/DashboardBiComponentStateModel"),
        WiringProducerViewModelCollection = require("dashboard/collection/filterManager/WiringProducerViewModelCollection"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        CanvasView = require('dashboard/view/base/CanvasView'),
        httpStatusCodes = require("common/enum/httpStatusCodes"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        DashboardModel = require('dashboard/model/DashboardModel'),
        sandboxFactory = require('dashboard/factory/sandboxFactory'),
        dashboardSchema = json3.parse(require("text!./schema/Dashboard.json"));

    var propertyNames = _.keys(dashboardSchema.properties),
        fieldNames = ['properties'],
        readOnlyFieldNames = ['data'];

    function checkContainerExistence(dfd, container) {
        var $container = $(container).first();

        if (!($container.length && $container[0].nodeType == "1")) {
            var err = biComponentErrorFactory.containerNotFoundError(container);
            log.error(err.toString());
            dfd.reject(err);
            return false;
        }

        return $container;
    }

    function tryRenderDashboard(dfd, instanceData, dashboardCanvas, resolveWith) {
        var $container = checkContainerExistence(dfd, instanceData.properties.container);

        if ($container) {
            var $dashboardCanvasEl = dashboardCanvas.$el;

            !$container.height() && $dashboardCanvasEl.height(dashboardSettings.DASHBOARD_CONTAINER_HEIGHT);

            $container.html($dashboardCanvasEl);

            resolveWith && dfd.resolve(resolveWith);
        }
    }

    function run(dfd, instanceData, dashboardModel, dashboardCanvas, stateModel) {
        var validationResult = this.validate(),
            self = this,
            err;

        if (validationResult) {
            err = biComponentErrorFactory.validationError(validationResult);
            log.error(err.toString());
            dfd.reject(err);
            return;
        }

        if (!stateModel.get("_fetched")) {
            // check if we have correct container (only in case it is provided)
            if (instanceData.properties.container) {
                if (!checkContainerExistence(dfd, instanceData.properties.container)) {
                    return;
                }
            }

            // we assume that this cannot be changed and are set only once
            dashboardSettings.CONTEXT_PATH = instanceData.properties.server;
            dashboardModel.set("uri", instanceData.properties.resource);
            dashboardModel.contextPath = instanceData.properties.server;

            // so make it read-only
            biComponentUtil.createReadOnlyProperty(this, "server", instanceData, true, stateModel);
            biComponentUtil.createReadOnlyProperty(this, "resource", instanceData, true, stateModel);

            // dirty hack to init everything with values passes through params()
            dashboardModel.once("resourcesDataFetched", function() {
                var foundation = _.findWhere(dashboardModel.get("foundations"), { id: dashboardModel.get("defaultFoundation") }),
                    components = dashboardModel.resources.get(foundation.components).resource.content;

                for (var id in instanceData.properties.params) {
                    if (instanceData.properties.params.hasOwnProperty(id)) {
                        var component = _.findWhere(components, { id: id });

                        if (component) {
                            component.value = instanceData.properties.params[id];
                        }
                    }
                }
            });

            dashboardModel
                .fetch()
                .done(function () {
                    stateModel.set("_fetched", true);

                    dashboardCanvas.componentViews.length
                    && $.when.apply($, _.pluck(dashboardCanvas.componentViews, "ready")).then(function () {
                        dashboardCanvas.ready.resolve();
                    });

                    dashboardCanvas.enableAutoRefresh();

                    var dashboardParamsCollection = WiringProducerViewModelCollection.createFromDashboardWiringCollection(
                        dashboardModel.currentFoundation.wiring, dashboardModel.currentFoundation.components);

                    instanceData.data.parameters = dashboardParamsCollection.map(function (producerModel) {
                        return { id: producerModel.component.get("id") }
                    });

                    if (instanceData.properties.linkOptions) {
                        _putLinkOptionsToSandbox(instanceData.properties.linkOptions, dashboardModel.cid);
                    }

                    if (instanceData.properties.container) {
                        tryRenderDashboard(dfd, instanceData, dashboardCanvas, self.data());
                    } else {
                        dfd.resolve(self.data());
                    }
                })
                .fail(function (xhr) {
                    err = biComponentErrorFactory.requestError(xhr);
                    log.error(err.toString());
                    dfd.reject(err);
                });
        } else {
            var changedAttrs = stateModel.changedAttributes();

            if (changedAttrs && "params" in changedAttrs) {
                var availableParameters = instanceData.data.parameters,
                    params = {};

                _.each(availableParameters, function(param) {
                    params[param.id] = param.id in instanceData.properties.params
                        ? instanceData.properties.params[param.id]
                        : params[param.id] = undefined;
                });

                for (var id in params) {
                    var componentModel = dashboardModel.currentFoundation.components.get(id);

                    if (componentModel) {
                        componentModel.set("value", params[id]);
                    }
                }

                dashboardModel.currentFoundation.components.getDashboardPropertiesComponent().applyParameters();
            }

            if (changedAttrs && "container" in changedAttrs) {
                tryRenderDashboard(dfd, instanceData, dashboardCanvas);
            }

            if (changedAttrs && "linkOptions" in changedAttrs) {
                var dashboardId = dashboardModel.cid,
                    views = dashboardCanvas.componentViews.filter(function(view) {
                        return view.model.isVisualization() &&
                            view.model.get("type") !== dashboardComponentTypes.WEB_PAGE_VIEW;
                    });

                //set new linkOptions to all visualizations
                _putLinkOptionsToSandbox(instanceData.properties.linkOptions, dashboardId);

                //re-render all visualizations which could depend on link options
                // and collect promises
                var promises = _.map(views, function(view) {
                    return view.component.run();
                });

                //resolve our deferred when all necessary views will be re-rendered
                $.when.apply(this, promises || []).done(_.partial(dfd.resolve, self.data()));

                return dfd;
            } else {
                return dfd.resolve(self.data());
            }
        }
    }

    function render(dfd, instanceData, dashboardCanvas) {
        tryRenderDashboard(dfd, instanceData, dashboardCanvas, dashboardCanvas.$el[0]);
    }

    function destroy(dfd, dashboardId, dashboardCanvas, stateModel) {
        dashboardCanvas.remove();

        sandboxFactory.get(dashboardId).set("linkOptions", null);
        stateModel.set("_destroyed", true);
        dashboardSettings.VISUALIZE_MODE = false;

        dfd.resolve();
    }

    function refresh(dfd, instanceData, dashboardModel, dashboardCanvas, stateModel) {
        var result = stateModel.get("_fetched")
            ? dashboardCanvas.refresh()
            : run.call(this, dfd, instanceData, dashboardModel, dashboardCanvas, stateModel);

        result
            .done(dfd.resolve)
            .fail(dfd.reject);
    }

    function cancel(dfd, dashboardCanvas, stateModel) {
        if (!stateModel.get("_fetched")) {
            dfd.resolve();
        } else {
            dashboardCanvas
                .cancel()
                .done(dfd.resolve)
                .fail(dfd.reject);
        }
    }

    function _putLinkOptionsToSandbox(linkOptions, dashboardId) {
        if (linkOptions) {
            sandboxFactory.get(dashboardId).set("linkOptions", linkOptions);
        }
    }

    var Dashboard = function(properties) {
        properties || (properties = {});

        // TODO: ideally this should be passed through options into CanvasView and DashboardModel
        dashboardSettings.VISUALIZE_MODE = true;

        var instanceData = {
            properties: _.cloneDeep(properties),
            data: {
                parameters: []
            }
        };

        var stateModel = new DashboardBiComponentStateModel(_.cloneDeep(properties)),
            dashboardModel = new DashboardModel(),
            dashboardId = dashboardModel.cid,
            dashboardCanvas = new CanvasView({
                model: dashboardModel,
                dashboardId: dashboardId
            });

        biComponentUtil.createInstancePropertiesAndFields(this, instanceData, propertyNames, fieldNames, readOnlyFieldNames, stateModel);

        _.extend(this, {
            validate: biComponentUtil.createValidateAction(instanceData, dashboardSchema, stateModel),
            run: biComponentUtil.createDeferredAction(run, stateModel, instanceData, dashboardModel, dashboardCanvas, stateModel),
            render: biComponentUtil.createDeferredAction(render, stateModel, instanceData, dashboardCanvas),
            refresh: biComponentUtil.createDeferredAction(refresh, stateModel, instanceData, dashboardModel, dashboardCanvas, stateModel),
            cancel: biComponentUtil.createDeferredAction(cancel, stateModel, dashboardCanvas, stateModel),
            destroy: biComponentUtil.createDeferredAction(destroy, stateModel, dashboardId, dashboardCanvas, stateModel)
        });
    };

    Dashboard.prototype = new BiComponent();

    return Dashboard;
});