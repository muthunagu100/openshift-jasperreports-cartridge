/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: DashletModel.js 853 2014-10-17 12:25:23Z agodovanets $
 */

define(function (require, exports, module) {
    "use strict";

    var $ = require("jquery"),
        _s = require("underscore.string"),
        _ = require("underscore"),
        DashboardComponentModel = require("./DashboardComponentModel"),
        dashboardSettings = require("../../dashboardSettings");

    return DashboardComponentModel.extend({
        defaults: _.extend({}, DashboardComponentModel.prototype.defaults, {
            selected: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }),

        toJSON: function () {
            var data = DashboardComponentModel.prototype.toJSON.apply(this, arguments);

            delete data.x;
            delete data.y;
            delete data.width;
            delete data.height;
            delete data.isAdhocChart;

            return data;
        },

        toHTML: function (calculatePosition) {
            var result = _s.sprintf(dashboardSettings.DASHLET_TEMPLATE.replace(/\(\\d\+\)/g, "%d").replace(/\(\[\\w\\d\]\+\)/g, "%s"),
                this.get("id"),
                    this.get("x") || 0,
                    this.get("y") || 0,
                    this.get("width") || 0,
                    this.get("height") || 0
            );

            if (calculatePosition === true) {
                result = $(result).css(this.getCssPosition())[0].outerHTML;
            }

            return result;
        },

        getCssPosition: function () {
            return {
                left: (100 * this.get("x") / dashboardSettings.GRID_WIDTH) + "%",
                top: (100 * this.get("y") / dashboardSettings.GRID_HEIGHT) + "%",
                width: (100 * this.get("width") / dashboardSettings.GRID_WIDTH) + "%",
                height: (100 * this.get("height") / dashboardSettings.GRID_HEIGHT) + "%"
            }
        },

        getPositionObject: function () {
            return {
                x: this.get("x"),
                y: this.get("y"),
                width: this.get("width"),
                height: this.get("height")
            }
        }
    }, {
        htmlToPositionObject: function (html) {
            var regexp = new RegExp(dashboardSettings.DASHLET_TEMPLATE),
                result,
                props = {};

            if (!regexp.test(html)) {
                throw new Error("Cannot parse HTML into object model: " + html);
            }

            result = regexp.exec(html);

            props.id = result[1];
            props.x = result[2] * 1;
            props.y = result[3] * 1;
            props.width = result[4] * 1;
            props.height = result[5] * 1;

            return props;
        }
    });
});