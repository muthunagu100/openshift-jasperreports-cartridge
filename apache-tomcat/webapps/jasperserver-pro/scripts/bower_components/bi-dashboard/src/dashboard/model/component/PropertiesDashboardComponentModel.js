/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: PropertiesDashboardComponentModel.js 985 2014-11-07 22:01:59Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var $ = require("jquery"),
        DashboardComponentModel = require("./DashboardComponentModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        i18n = require("bundle!DashboardBundle"),
        dashboardWiringStandardIds = require("dashboard/enum/dashboardWiringStandardIds"),
        ValidationError = require("common/validation/ValidationErrorMessage"),
        dashboardSettings = require("dashboard/dashboardSettings");

    return DashboardComponentModel.extend({
        defaults: {
            "id": dashboardSettings.DASHBOARD_PROPERTIES_COMPONENT_ID,
            "type": dashboardComponentTypes.DASHBOARD_PROPERTIES,
            "name": dashboardSettings.DASHBOARD_PROPERTIES_COMPONENT_ID,
            "autoRefresh": dashboardSettings.DASHBOARD_AUTO_REFRESH,
            "refreshInterval": dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_DEFAULT_MINUTES,
            "refreshIntervalUnit": dashboardSettings.DASHBOARD_REFRESH_INTERVAL_UNIT,
            "showDashletBorders": dashboardSettings.DASHLET_BORDER,
            "dashletMargin": dashboardSettings.DASHLET_MARGIN,
            "dashletPadding": dashboardSettings.DASHLET_PADDING
        },

        validation: {
            refreshInterval: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.refreshInterval.required")
                },
                {
                    integerNumber: true,
                    msg: new ValidationError("dashboard.error.refreshInterval.integer")
                },
                {
                    fn: function(value, attr, computedState){
                        var currentUnits = computedState["refreshIntervalUnit"];
                        var units = {"second": dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_SECONDS,
                                     "minute": dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_MINUTES};
                        if(value < units[currentUnits]){
                            return "Value must be bigger than " + units[currentUnits];
                        }
                    },
                    msg: new ValidationError("dashboard.error.refreshInterval.min", dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_MINUTES,
                                                                                    dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_SECONDS)
                }
            ],

            refreshIntervalUnit: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.refreshIntervalUnit.required")
                },
                {
                    oneOf: ["second", "minute"],
                    msg: new ValidationError("dashboard.error.refreshIntervalUnit.oneOf",
                        i18n["dashboard.dialog.properties.refresh.interval.second"], i18n["dashboard.dialog.properties.refresh.interval.minute"])
                }
            ],

            dashletMargin: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.dashletMargin.required")
                },
                {
                    integerNumber: true,
                    msg: new ValidationError("dashboard.error.dashletMargin.integer")
                },
                {
                    range: [dashboardSettings.DASHLET_MIN_MARGIN, dashboardSettings.DASHLET_MAX_MARGIN],
                    msg: new ValidationError("dashboard.error.dashletMargin.range", dashboardSettings.DASHLET_MIN_MARGIN, dashboardSettings.DASHLET_MAX_MARGIN)
                }
            ],

            dashletPadding: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.dashletMargin.required")
                },
                {
                    integerNumber: true,
                    msg: new ValidationError("dashboard.error.dashletPadding.integer")
                },
                {
                    range: [dashboardSettings.DASHLET_MIN_PADDING, dashboardSettings.DASHLET_MAX_PADDING],
                    msg: new ValidationError("dashboard.error.dashletPadding.range", dashboardSettings.DASHLET_MIN_PADDING, dashboardSettings.DASHLET_MAX_PADDING)
                }
            ]
        },

        initialize: function() {
            DashboardComponentModel.prototype.initialize.apply(this, arguments);

            this.on("change:autoRefresh", function() {
                if (!this.get("autoRefresh") && !this.isValid(["refreshInterval", "refreshIntervalUnit"])) {
                    this.set({
                        refreshInterval: this.defaults.refreshInterval,
                        refreshIntervalUnit: this.defaults.refreshIntervalUnit
                    });
                }
            }, this);
        },

        isVisible: function(){
            return false;
        },

        applyParameters: function() {
            this.trigger(dashboardWiringStandardIds.APPLY_SIGNAL, {});
        },

        acceptWiringVisitor: function (visitor) {
            visitor.register(this, {
                signals: [ dashboardWiringStandardIds.INIT_SIGNAL, dashboardWiringStandardIds.APPLY_SIGNAL ],
                slots: {}
            });
        }
    });
});
