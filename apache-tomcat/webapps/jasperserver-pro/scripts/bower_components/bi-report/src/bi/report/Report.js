/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: Report.js 2833 2014-11-09 15:19:31Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        json3 = require("json3"),
        Backbone = require("backbone"),
        log = require("logger").register(module),
        biComponentUtil = require("common/bi/component/util/biComponentUtil"),
        BiComponent = require("common/bi/component/BiComponent"),
        biComponentErrorCodes = require("common/bi/error/enum/biComponentErrorCodes"),
        biComponentErrorFactoryReportProxy = require("./error/biComponentErrorFactoryReportProxy"),
        ReportModel = require("./model/ReportModel"),
        ReportController = require("./ReportController"),
        ReportExportModel = require("./model/ReportExportModel"),
        ReportPropertiesModel = require("./model/ReportPropertiesModel"),
        ReportView = require("./view/ReportView"),
        reportOutputFormats = require("./enum/reportOutputFormats"),
        jiveTypes = require("./jive/enum/jiveTypes"),
        interactiveComponentTypes = require("./jive/enum/interactiveComponentTypes"),
        reportEvents = require("./enum/reportEvents"),
        reportSchema = json3.parse(require("text!./schema/Report.json")),
        reportExportSchema = json3.parse(require("text!./schema/ReportExport.json")),
        chartSchema = json3.parse(require("text!./schema/Chart.json")),
        crosstabColumnSchema = json3.parse(require("text!./schema/CrosstabDataColumn.json")),
        crosstabRowSchema = json3.parse(require("text!./schema/CrosstabRowGroup.json")),
        tableColumnSchema = json3.parse(require("text!./schema/TableColumn.json"));

    var propertyNames = _.keys(reportSchema.properties),
        fieldNames = ['properties'],
        readOnlyFieldNames = ['data'],
        reportBiComponentEvents = {
            CHANGE_TOTAL_PAGES: "changeTotalPages",
            CAN_UNDO: "canUndo",
            CAN_REDO: "canRedo",
            BEFORE_RENDER: "beforeRender",
            PAGE_FINAL: "pageFinal",
            REPORT_COMPLETED: "reportCompleted"
        };

    function reportParameters(params) {
        var parameters = null;

        if (params && _.keys(params).length) {
            parameters = {
                reportParameter: _.map(params, function(value, key) { return { name: key, value: value }; })
            };
        }

        return parameters;
    }

    var componentTypeToSchema = {};
    componentTypeToSchema[interactiveComponentTypes.CHART] = chartSchema;
    componentTypeToSchema[interactiveComponentTypes.CROSSTAB_COLUMN] = crosstabColumnSchema;
    componentTypeToSchema[interactiveComponentTypes.CROSSTAB_ROW] = crosstabRowSchema;
    componentTypeToSchema[interactiveComponentTypes.TABLE_COLUMN] = tableColumnSchema;

    function run(dfd, instanceData, controller, refresh, stateModel) {
        var validationResult = this.validate(),
            prevPages, prevParameters,
            self = this, err;

        if (validationResult) {
            err = biComponentErrorFactoryReportProxy.validationError(validationResult);
            log.error(err.toString());
            dfd.reject(err);
	        return;
        }

	    if (instanceData.properties.isolateDom &&
                (_.isUndefined(instanceData.properties.defaultJiveUi) ||
                instanceData.properties.defaultJiveUi.enabled !== false )
        ) {
            err = biComponentErrorFactoryReportProxy.genericError(
                biComponentErrorCodes.UNSUPPORTED_CONFIGURATION_ERROR,
                "Default JIVE UI should be disabled when isolateDom option is true");
            log.error(err.toString());
            dfd.reject(err);
		    return;
        }

	    // check if we have correct container (only in case it is provided)
	    if (instanceData.properties.container) {
		    var $container = $(instanceData.properties.container);
		    if (!($container.length && $container[0].nodeType == "1")) {
			    err = biComponentErrorFactoryReportProxy.containerNotFoundError(instanceData.properties.container);
			    log.error(err.toString());
			    dfd.reject(err);
			    return;
		    }
		    // set the report container
		    controller.view.setContainer($container);
	    }


        // we assume that this cannot be changed and are set only once
        controller.model.set("reportURI", instanceData.properties.resource);
        controller.model.contextPath = instanceData.properties.server;
        // so make it read-only
        biComponentUtil.createReadOnlyProperty(this, "server", instanceData, true, stateModel);
        biComponentUtil.createReadOnlyProperty(this, "resource", instanceData, true, stateModel);

        prevParameters = controller.model.execution.get("parameters");
        prevPages = controller.model.execution.get("pages");

        _.extend(controller.model.getExport(reportOutputFormats.HTML).get("options"), { "pages": instanceData.properties.pages });
        controller.model.execution.set({
            "pages": instanceData.properties.pages,
            "scale": instanceData.properties.scale,
            "parameters": reportParameters(instanceData.properties.params)
        });

        var changedAttributes = controller.model.execution.changedAttributes(),
            parametersChanged = changedAttributes && "parameters" in changedAttributes,
            pagesChanged = changedAttributes && "pages" in changedAttributes;

        var tryRenderReport = function() {
            if (!instanceData.properties.container) {
                dfd.resolve(self.data());
            } else {
                controller.renderReport().always(function () {
                    dfd.resolve(self.data());
                });
            }
        };

        var onSuccessfulRun = function () {
            instanceData.data.totalPages = controller.model.get("totalPages");
            instanceData.data.components = controller.components.getComponents();
            instanceData.data.links = controller.components.getLinks();

            tryRenderReport();
        };

        var onFailedRun = function (error) {
            controller.view.hideOverlay();

            parametersChanged && controller.model.execution.set({parameters: prevParameters}, {silent: true});

            if(pagesChanged){
                controller.model.execution.set({pages: prevPages}, {silent: true});
                instanceData.properties.pages = prevPages;
            }

            // reject with specific error if we have one
            if (error.errorDescriptor && error.errorDescriptor.errorCode) {
                var err = biComponentErrorFactoryReportProxy.genericError(
                    error.errorDescriptor.errorCode, error.errorDescriptor.message, error.errorDescriptor.parameters);

                log.error(err.toString());
                dfd.reject(err);
            } else if (error.source === "export" || error.source === "execution") {
                var err = biComponentErrorFactoryReportProxy.reportStatus(error);

                if (_.include([
                    biComponentErrorCodes.REPORT_EXECUTION_FAILED,
                    biComponentErrorCodes.REPORT_EXECUTION_CANCELLED,
                    biComponentErrorCodes.REPORT_EXPORT_FAILED,
                    biComponentErrorCodes.REPORT_EXPORT_CANCELLED], err)) {
                    log.error(err.toString());
                } else {
                    log.error("Report " + error.source + (error.source === "export" ? (" to format '" + error.format + "'") : "") + " " + error.status + ": " + err.toString());
                }

                dfd.reject(err);
            } else {
                var err = biComponentErrorFactoryReportProxy.requestError(error);

                log.error(err.toString());
                dfd.reject(err);
            }
        };

	    controller.view.showOverlay();

        if (controller.model.isNew()) {
            controller
                .executeReport(refresh)
                .then(onSuccessfulRun, onFailedRun);
        } else {
            if (parametersChanged || refresh) {
                controller
                    .applyReportParameters(refresh)
                    .then(onSuccessfulRun, onFailedRun);
            } else {
                if (pagesChanged) {
                    controller
                        .fetchReportHtmlExportAndJiveComponents()
                        .then(onSuccessfulRun, onFailedRun);
                } else {
                    tryRenderReport();
                }
            }
        }
    }

    function render(dfd, instanceData, controller) {
        if (controller.view.setContainer(instanceData.properties.container) === false) {
            var err = biComponentErrorFactoryReportProxy.containerNotFoundError(instanceData.properties.container);

            log.error(err.toString());
            dfd.reject(err);
            return;
        }

        controller.renderReport(instanceData.properties.container).done(function () {
            dfd.resolve(controller.view.$el[0]);
        });
    }

    function cancel(dfd, controller) {
        controller.cancelReportExecution()
            .done(dfd.resolve)
            .fail(function(error) {
                var err = biComponentErrorFactoryReportProxy.requestError(error);

                log.error(err.toString());
                dfd.reject(err);
            });
    }

    function undo(dfd, controller) {
        controller.undoReportAction()
            .done(dfd.resolve)
            .fail(function(error) {
                var err = biComponentErrorFactoryReportProxy.requestError(error);

                log.error(err.toString());
                dfd.reject(err);
            });
    }

    function undoAll(dfd, controller) {
        controller.undoAllReportAction()
            .done(dfd.resolve)
            .fail(function(error) {
                var err = biComponentErrorFactoryReportProxy.requestError(error);

                log.error(err.toString());
                dfd.reject(err);
            });
    }

    function redo(dfd, controller) {
        controller.redoReportAction()
            .done(dfd.resolve)
            .fail(function(error) {
                var err = biComponentErrorFactoryReportProxy.requestError(error);

                log.error(err.toString());
                dfd.reject(err);
            });
    }

    function destroy(dfd, controller, stateModel) {
        controller.destroy()
            .done(function() {
                stateModel.set("_destroyed", true);
                dfd.resolve();
            })
            .fail(function(error) {
                var err = biComponentErrorFactoryReportProxy.requestError(error);

                log.error(err.toString());
                dfd.reject(err);
            });
    }

    function createExportAction(controller, stateModel) {
        return function(options, success, error, always) {
            var dfd, validationResult, err;

            if (stateModel.get("_destroyed")) {
                err = biComponentErrorFactoryReportProxy.alreadyDestroyedError();
                log.error(err.toString());
                dfd = (new $.Deferred()).reject(err);
            } else {
                try {
                    validationResult = biComponentUtil.validateObject(reportExportSchema, options);

                    if (validationResult) {
                        dfd = new $.Deferred();
                        err = biComponentErrorFactoryReportProxy.validationError(validationResult);

                        log.error(err.toString());
                        dfd.reject(err);
                    } else {
                        dfd = controller.exportReport(options);
                    }
                } catch (ex) {
                    dfd = new $.Deferred();
                    err = biComponentErrorFactoryReportProxy.javaScriptException(ex);

                    log.error(err.toString());
                    dfd.reject(err);
                }
            }

            dfd.done(success).fail(error).always(always);

            return dfd;
        }
    }

    function createUpdateComponentAction(controller, stateModel) {
        return function() {
            var dfd = new $.Deferred(),
	            err,
                id,
                properties,
                successCallback,
                errorCallback,
                completeCallback;

            if (stateModel.get("_destroyed")) {
                err = biComponentErrorFactoryReportProxy.alreadyDestroyedError();
                log.error(err.toString());

                dfd.reject(err);
            } else {
                try {
                    if (_.isString(arguments[0])) {
                        id = arguments[0];
                        properties = arguments[1];
                        successCallback = arguments[2];
                        errorCallback = arguments[3];
                        completeCallback = arguments[4];
                    } else {
                        properties = arguments[0];
                        id = properties.id;
                        successCallback = arguments[1];
                        errorCallback = arguments[2];
                        completeCallback = arguments[3];
                    }

                    successCallback && _.isFunction(successCallback) && dfd.done(successCallback);
                    errorCallback && _.isFunction(errorCallback) && dfd.fail(errorCallback);
                    completeCallback && _.isFunction(completeCallback) && dfd.always(completeCallback);

                    var componentToUpdate = _.findWhere(controller.components.getComponents(), { name: id })
                        || _.findWhere(controller.components.getComponents(), { id: id });

                    if (!componentToUpdate) {
                        throw new Error("Component with such name or id '" + id + "' was not found");
                    }

                    var updatedComponent = _.extend(componentToUpdate, properties),
                        componentSchema = componentTypeToSchema[updatedComponent.componentType];

                    if (!componentSchema) {
                        throw new Error("Cannot validate component - unknown component type '" + updatedComponent.componentType + "'");
                    }

                    var validationResult = biComponentUtil.validateObject(componentSchema, componentToUpdate);

                    if (validationResult) {
                        err = biComponentErrorFactoryReportProxy.validationError(validationResult);

                        log.error(err.toString());
                        dfd.reject(err);
                    } else {
                        var actions = controller.components.updateComponents([ updatedComponent ]);

                        if (actions && _.isArray(actions)) {
                            actions = _.compact(actions);
                        }

                        if (actions && _.isArray(actions) && actions.length) {
                            controller
                                .runReportAction(actions)
                                .then(function () {
                                    dfd.resolve(_.findWhere(controller.components.getComponents(), { name: id }));
                                }, function (error) {
                                    var err;
                                    if (error.source === "export" || error.source === "execution") {
                                        err = biComponentErrorFactoryReportProxy.reportStatus(error);

                                        if (_.include([
                                            biComponentErrorCodes.REPORT_EXECUTION_FAILED,
                                            biComponentErrorCodes.REPORT_EXECUTION_CANCELLED,
                                            biComponentErrorCodes.REPORT_EXPORT_FAILED,
                                            biComponentErrorCodes.REPORT_EXPORT_CANCELLED], err)) {
                                            log.error(err.toString());
                                        } else {
                                            log.error("Report " + error.source + (error.source === "export" ? (" to format '" + error.format + "'") : "") + " " + error.status + ": " + err.toString());
                                        }

                                        dfd.reject(err);
                                    } else {
                                        err = biComponentErrorFactoryReportProxy.requestError(error);

                                        log.error(err.toString());
                                        dfd.reject(err);
                                    }
                                });
                        } else {
                            dfd.resolve(_.findWhere(controller.components.getComponents(), { name: id }));
                        }
                    }
                }
                catch (ex) {
                    err = biComponentErrorFactoryReportProxy.javaScriptException(ex);

                    log.error(err.toString());
                    dfd.reject(biComponentErrorFactoryReportProxy.javaScriptException(ex));
                }
            }

            return dfd;
        };
    }

    function createEventsFunction(instanceData, eventManager, controller, stateModel) {
        return function(events) {
            if (stateModel.get("_destroyed")) {
                throw biComponentErrorFactoryReportProxy.alreadyDestroyedError();
            }

            var self = this;

            if (!events || !_.isObject(events) || !_.keys(events).length) {
                return self;
            }

            _.each(instanceData.events, function(value, key) {
                if (_.isFunction(value)) {
                    if (key === reportBiComponentEvents.CHANGE_TOTAL_PAGES) {
                        eventManager.stopListening(controller.model, "change:totalPages", value);
                    } else if (key === reportBiComponentEvents.CAN_REDO || key === reportBiComponentEvents.CAN_UNDO) {
                        eventManager.stopListening(controller.stateStack, "change:position", value);
                    } else if (key === reportBiComponentEvents.REPORT_COMPLETED) {
                        eventManager.stopListening(controller, reportEvents.REPORT_COMPLETED, value);
                    } else if (key === reportBiComponentEvents.PAGE_FINAL) {
                        eventManager.stopListening(controller, reportEvents.PAGE_FINAL, value);
                    }else if(key === reportBiComponentEvents.BEFORE_RENDER){
                        eventManager.stopListening(controller.view, reportEvents.BEFORE_RENDER, value);
                    }
                }
            });

            _.each(events, function(value, key) {
                if (_.isFunction(value)) {
                    if (key === reportBiComponentEvents.CHANGE_TOTAL_PAGES) {
                        instanceData.events[key] = function() {
                            value.call(self, controller.model.get("totalPages"));
                        };
                    } else if (key === reportBiComponentEvents.CAN_UNDO) {
                        instanceData.events[key] = function() {
                            value.call(self, controller.stateStack.get("canUndo"))
                        };
                    } else if (key === reportBiComponentEvents.CAN_REDO) {
                        instanceData.events[key] = function() {
                            value.call(self, controller.stateStack.get("canRedo"))
                        };
                    }else if (key === reportBiComponentEvents.PAGE_FINAL) {
                        instanceData.events[key] = function(markup) {
                            value.call(self, markup)
                        };
                    } else if (key === reportBiComponentEvents.REPORT_COMPLETED) {
                        instanceData.events[key] = function(status, error) {
                            if (error) {
                                try {
                                    if (error.source === "export" || error.source === "execution") {
                                        error = biComponentErrorFactoryReportProxy.reportStatus(error);
                                    } else {
                                        error = biComponentErrorFactoryReportProxy.requestError(error);
                                    }
                                } catch(ex) {
                                    error = biComponentErrorFactoryReportProxy.javaScriptException(ex);
                                }
                            }
                            value.call(self, status, error);
                        };
                    }else if (key === reportBiComponentEvents.BEFORE_RENDER) {
                        instanceData.events[key] = _.bind(value, self);
                    }
                }
            });

            _.each(instanceData.events, function(value, key) {
                if (_.isFunction(value)) {
                    if (key === reportBiComponentEvents.CHANGE_TOTAL_PAGES) {
                        eventManager.listenTo(controller.model, "change:totalPages", value);
                    } else if (key === reportBiComponentEvents.CAN_REDO) {
                        eventManager.listenTo(controller.stateStack, "change:canRedo", value);
                    } else if (key === reportBiComponentEvents.CAN_UNDO) {
                        eventManager.listenTo(controller.stateStack, "change:canUndo", value);
                    } else if (key === reportBiComponentEvents.PAGE_FINAL) {
                        eventManager.listenTo(controller, reportEvents.PAGE_FINAL, value);
                    } else if (key === reportBiComponentEvents.REPORT_COMPLETED) {
                        eventManager.listenTo(controller, reportEvents.REPORT_COMPLETED, value);
                    } else if (key === reportBiComponentEvents.BEFORE_RENDER) {
                        eventManager.listenTo(controller.view, reportEvents.BEFORE_RENDER, value);
                    }
                }
            });

            return self;
        }
    }

    var Report = function(properties) {
        properties || (properties = {});

        var events = properties.events,
            instanceData = {
                properties: _.extend({
                    pages: 1
                }, properties),
                data: {
                    totalPages: undefined,
                    components: [],
                    links: []
                },
                events: {}
            };

        delete instanceData.properties.events;
        var stateModel = new ReportPropertiesModel(properties || {});

        biComponentUtil.createInstancePropertiesAndFields(this, instanceData, propertyNames, fieldNames, readOnlyFieldNames, stateModel);

        var controller = new ReportController(stateModel),
            eventManager = _.extend({}, Backbone.Events);

        // hack to prevent CSS overrides
        controller.view.$el.addClass("visualizejs _jr_report_container_");

        eventManager.listenTo(controller.model, "change:totalPages", function() {
            instanceData.data.totalPages = controller.model.get("totalPages");
        });

        eventManager.listenTo(controller.components, "change add reset remove", function() {
            instanceData.data.components = controller.components.getComponents();
            instanceData.data.links = controller.components.getLinks();
        });

        eventManager.listenTo(controller, reportEvents.AFTER_REPORT_EXECUTION, function() {
            instanceData.properties.pages = 1;
        });

        _.extend(this, {
            validate: biComponentUtil.createValidateAction(instanceData, reportSchema, stateModel),
            run: biComponentUtil.createDeferredAction(run, stateModel, instanceData, controller, false, stateModel),
            refresh: biComponentUtil.createDeferredAction(run, stateModel, instanceData, controller, true, stateModel),
            render: biComponentUtil.createDeferredAction(render, stateModel, instanceData, controller),
            cancel: biComponentUtil.createDeferredAction(cancel, stateModel, controller),
            undo: biComponentUtil.createDeferredAction(undo, stateModel, controller),
            undoAll: biComponentUtil.createDeferredAction(undoAll, stateModel, controller),
            redo: biComponentUtil.createDeferredAction(redo, stateModel, controller),
            destroy: biComponentUtil.createDeferredAction(destroy, stateModel, controller, stateModel),
            'export': createExportAction(controller, stateModel),
            updateComponent: createUpdateComponentAction(controller, stateModel),
            events: createEventsFunction(instanceData, eventManager, controller, stateModel)
        });

        // init events
        this.events(events);
    };

    Report.prototype = new BiComponent();

    _.extend(Report, {
        exportFormats: ["pdf", "xlsx", "xls", "rtf", "csv", "xml", "odt", "ods", "docx", "pptx"],
        chart: {
            componentTypes: ["chart"],
            //TODO: take from json schema
            types:["Bar", "Column", "Line", "Area", "Spline",
                "AreaSpline", "StackedBar", "StackedColumn", "StackedLine", "StackedArea",
                "StackedSpline", "StackedAreaSpline", "StackedPercentBar", "StackedPercentColumn", "StackedPercentLine",
                "StackedPercentArea", "StackedPercentSpline", "StackedPercentAreaSpline", "Pie",
                "DualLevelPie", "TimeSeriesLine", "TimeSeriesArea", "TimeSeriesSpline",
                "TimeSeriesAreaSpline", "ColumnLine", "ColumnSpline", "StackedColumnLine",
                "StackedColumnSpline", "MultiAxisLine", "MultiAxisSpline", "MultiAxisColumn",
                "Scatter", "Bubble", "SpiderColumn", "SpiderLine", "SpiderArea","HeatMap","TimeSeriesHeatMap"
            ]
        },
        table: {
            componentTypes: ["tableColumn"],
            column: {
                types: ["numeric", "boolean", "datetime", "string", "time"]
            }
        },
        crosstab: {
            componentTypes: ["crosstabDataColumn", "crosstabRowGroup"]
        }
    });

    return Report;
});