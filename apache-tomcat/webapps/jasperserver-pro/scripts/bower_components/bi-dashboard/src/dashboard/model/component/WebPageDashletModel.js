/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $
 */

define(function (require) {
    "use strict";

    var DashletModel = require("./DashletModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        ValidationError = require("common/validation/ValidationErrorMessage"),
        i18n = require("bundle!DashboardBundle"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        _ = require("underscore");

    return DashletModel.extend({
        componentName: i18n['dashboard.component.web.page.component.name'],

        defaults: _.extend({}, DashletModel.prototype.defaults, {
            type: dashboardComponentTypes.WEB_PAGE_VIEW,

            timeout: undefined,
            url: dashboardSettings.DASHLET_WEBPAGE_VIEW_DEFAULT_URL,

            autoRefresh: dashboardSettings.DASHLET_AUTO_REFRESH,
            refreshInterval: dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_DEFAULT_MINUTES,
            refreshIntervalUnit: dashboardSettings.DASHBOARD_REFRESH_INTERVAL_UNIT,

            scroll: dashboardSettings.DASHLET_SCROLL,
            showTitleBar: dashboardSettings.DASHLET_SHOW_TITLE_BAR,
            showRefreshButton: dashboardSettings.DASHLET_SHOW_REFRESH_BUTTON,
            showMaximizeButton: dashboardSettings.DASHLET_SHOW_MAXIMIZE_BUTTON
        }),

        validation: _.extend({}, DashletModel.prototype.validation, {
            url: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.component.error.url.required")
                },
                {
                    url: true,
                    msg: new ValidationError("dashboard.component.error.url.required")
                },
                {
                    doesNotContainSymbols: "{}^\"\"\\<\\>\\|\\\\",
                    msg: new ValidationError("dashboard.component.error.url.forbidden.chars")
                }
            ],
            refreshInterval: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.web.page.view.refreshInterval.required")
                },
                {
                    integerNumber: true,
                    msg: new ValidationError("dashboard.error.web.page.view.refreshInterval.integer")
                },
                {
                    fn: function(value, attr, computedState) {
                        var currentUnits = computedState["refreshIntervalUnit"];
                        var units = {"second": dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS,
                            "minute": dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES};
                        if (value < units[currentUnits]) {
                            return "Value must be bigger than " + units[currentUnits];
                        }
                    },
                    msg: new ValidationError("dashboard.error.web.page.view.refreshInterval.min", dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES,
                        dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS)
                }
            ],
            refreshIntervalUnit: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.error.web.page.view.refreshIntervalUnit.required")
                },
                {
                    oneOf: ["second", "minute"],
                    msg: new ValidationError("dashboard.error.web.page.view.refreshIntervalUnit.oneOf",
                        i18n["dashboard.dialog.properties.refresh.interval.second"], i18n["dashboard.dialog.properties.refresh.interval.minute"])
                }
            ]
        }),

        initialize: function() {
            DashletModel.prototype.initialize.apply(this, arguments);

            this.on("change:autoRefresh", function() {
                if (!this.get("autoRefresh") && !this.isValid(["refreshInterval", "refreshIntervalUnit"])) {
                    this.set({
                        refreshInterval: this.defaults.refreshInterval,
                        refreshIntervalUnit: this.defaults.refreshIntervalUnit
                    });
                }
            }, this);
        }
    });

});