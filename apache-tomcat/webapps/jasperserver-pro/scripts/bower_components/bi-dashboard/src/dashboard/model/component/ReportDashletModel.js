/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: ReportDashletModel.js 985 2014-11-07 22:01:59Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        log = require("logger").register(module),
        request = require("common/transport/request"),
        i18n = require("bundle!DashboardBundle"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        dashboardWiringStandardIds = require("../../enum/dashboardWiringStandardIds"),
        DashletModel = require("./DashletModel"),
        ValidationError = require("common/validation/ValidationErrorMessage"),
        ParametersCache = require("../../collection/ReportsParametersCollection").instance,
        dashboardSettings = require("dashboard/dashboardSettings"),
        scaleStrategies = require("bi/report/enum/scaleStrategies");

    function convertICDataToWiringInfo(model, parameters){
        var res = {
            signals: [],
            slots: {}
        };

        _.each(parameters.concat([
            {id:dashboardWiringStandardIds.APPLY_SLOT},
            {id:dashboardWiringStandardIds.REFRESH_SLOT}]), function(parameter){
            res.slots[parameter.id] = function(name){
                return function(value, sender){
                    model.lastPayload =  {
                        name: name,
                        value: value
                    }
                    model.lastSender = sender;
                    model.trigger("signal",model.lastPayload, sender);
                }
            }(parameter.id);
        });

        return res;
    }

    return DashletModel.extend({
        componentName: i18n['dashboard.component.report.component.name'],

        defaults: _.extend({}, DashletModel.prototype.defaults, {
            type: dashboardComponentTypes.REPORT,

            scaleToFit: dashboardSettings.DASHLET_SCALE_TO_FIT,

            autoRefresh: dashboardSettings.DASHLET_AUTO_REFRESH,
            refreshInterval: dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_DEFAULT_MINUTES,
            refreshIntervalUnit: dashboardSettings.DASHBOARD_REFRESH_INTERVAL_UNIT,

            showTitleBar: dashboardSettings.DASHLET_SHOW_TITLE_BAR,
            showRefreshButton: dashboardSettings.DASHLET_SHOW_REFRESH_BUTTON,
            showMaximizeButton: dashboardSettings.DASHLET_SHOW_MAXIMIZE_BUTTON
        }),

        validation: _.extend({}, DashletModel.prototype.validation, {
            scaleToFit: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.component.error.scale.to.fit.required")
                },
                {
                    oneOf: [1, scaleStrategies.HEIGHT, scaleStrategies.WIDTH, scaleStrategies.CONTAINER],
                    msg: new ValidationError("dashboard.component.error.scale.to.fit.oneOf",
                        i18n["dashboard.component.dialog.properties.scale.to.fit.no"], i18n["dashboard.component.dialog.properties.scale.to.fit.width"],
                        i18n["dashboard.component.dialog.properties.scale.to.fit.height"], i18n["dashboard.component.dialog.properties.scale.to.fit.page"])
                }
            ],

            refreshInterval: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.report.refreshInterval.required")
                },
                {
                    integerNumber: true,
                    msg: new ValidationError("dashboard.error.report.refreshInterval.integer")
                },
                {
                    fn: function(value, attr, computedState){
                        var currentUnits = computedState["refreshIntervalUnit"];
                        var units = {"second": dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS,
                                     "minute": dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES};
                        if(value < units[currentUnits]){
                            return "Value must be bigger than " + units[currentUnits];
                        }
                    },
                    msg: new ValidationError("dashboard.error.report.refreshInterval.min", dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES,
                                                                                    dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS)
                }
            ],
            refreshIntervalUnit: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.report.refreshIntervalUnit.required")
                },
                {
                    oneOf: ["second", "minute"],
                    msg: new ValidationError("dashboard.error.report.refreshIntervalUnit.oneOf",
                        i18n["dashboard.dialog.properties.refresh.interval.second"], i18n["dashboard.dialog.properties.refresh.interval.minute"])
                }
            ]
        }),

        initialize: function(){
            this.paramsDfd = new $.Deferred();
            this.componentInitializedDfd = new $.Deferred();

            DashletModel.prototype.initialize.apply(this, arguments);

            this.set("dataSourceUri", this._getDataSourceUri());

            this.on("change:autoRefresh", function() {
                if (!this.get("autoRefresh") && !this.isValid(["refreshInterval", "refreshIntervalUnit"])) {
                    this.set({
                        refreshInterval: this.defaults.refreshInterval,
                        refreshIntervalUnit: this.defaults.refreshIntervalUnit
                    });
                }
            }, this);
        },

        getReportResourceUri: function() {
            return this.componentInitializedDfd.resolve(this.resource.resource.get("uri")).promise();
        },

        _getDataSourceUri: function() {
            return (this.resource && this.resource.resource && this.resource.resource.get("uri")) || this.get("dataSourceUri");
        },

        _getWiringMetadata: function(){
            var self = this;

            if (this.paramsDfd.state() === "pending" && !this.paramsDfd._running){
                if (this.get("parameters")) {
                    log.debug("Loaded parameters from previous loaded state for " + this.resource.get("name"));

                    this.paramsDfd.resolve(this, convertICDataToWiringInfo(this, this.get("parameters")))
                } else {
                    this.paramsDfd._running = true;

                    log.debug("Started loading of parameters for " + self.resource.get("name"));

                    var uriDfd = this.getReportResourceUri().fail(_.bind(this.paramsDfd.reject, this.paramsDfd)),
                        parametersDfd = ParametersCache.getReportParameters(this.resource.resource.get("uri"))
                            .fail(_.bind(this.paramsDfd.reject, this.paramsDfd)).done(function (parameters) {

                            log.debug("Finished loading of parameters for " + self.resource.get("name"));

                            self.set("parameters", _.map(parameters, function(paramObj) {
                                return {
                                    id: paramObj.id,
                                    uri: paramObj.uri,
                                    label: paramObj.label
                                };
                            }));
                        });

                    $.when(uriDfd, parametersDfd).then(function(uri, parameters){
                        self.paramsDfd.resolve(self, convertICDataToWiringInfo(self, parameters));
                    })
                }
            }

            return this.paramsDfd.promise();
        }
    });
});