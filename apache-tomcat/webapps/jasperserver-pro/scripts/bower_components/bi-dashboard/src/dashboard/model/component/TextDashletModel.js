/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: TextDashletModel.js 931 2014-10-30 13:08:17Z tbidyuk $
 */

define(function (require) {
    "use strict";

    var DashletModel = require("./DashletModel"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        i18n = require("bundle!DashboardBundle"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        ValidationError = require("common/validation/ValidationErrorMessage"),
        _ = require("underscore");

    return DashletModel.extend({
        "componentName": i18n["dashboard.component.text.view.component.name"],

        defaults: _.extend({}, DashletModel.prototype.defaults, {
            "type": dashboardComponentTypes.FREE_TEXT,
            "alignment": dashboardSettings.DASHLET_TEXT_ALIGNMENT,
            "bold": dashboardSettings.DASHLET_TEXT_BOLD,
            "text": undefined,
            "italic": dashboardSettings.DASHLET_TEXT_ITALIC,
            "font": dashboardSettings.DASHLET_TEXT_FONT,
            "size": dashboardSettings.DASHLET_TEXT_SIZE,
            "color": dashboardSettings.DASHLET_TEXT_COLOR,
            "backgroundColor": dashboardSettings.DASHLET_TEXT_BACKGROUND_COLOR
        }),

        validation: _.extend({}, DashletModel.prototype.validation, {
            alignment: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.component.error.alignment.required")
                },
                {
                    oneOf: ["left", "center", "right"],
                    msg: new ValidationError("dashboard.component.error.alignment.oneOf",
                        i18n["dashboard.component.dialog.properties.alignment.left"], i18n["dashboard.component.dialog.properties.alignment.center"],
                        i18n["dashboard.component.dialog.properties.alignment.right"])
                }
            ],

            font: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.component.error.font.required")
                },
                {
                    doesNotContainSymbols: "~!#\\$%^|`@&*()\\+={}\\[\\];\"\"\\<\\>,?\\|\\\\",
                    msg: new ValidationError("dashboard.component.error.font.forbidden.chars")
                }
            ],

            size: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.component.error.font.size.required")
                },
                {
                    integerNumber: true,
                    msg: new ValidationError("dashboard.component.error.font.size.integer")
                },
                {
                    min: dashboardSettings.DASHLET_MIN_FONT_SIZE,
                    msg: new ValidationError("dashboard.component.error.font.size.min", dashboardSettings.DASHLET_MIN_FONT_SIZE)
                }
            ]
        })
    });
});