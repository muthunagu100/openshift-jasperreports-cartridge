/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: ValueDashboardComponentModel.js 851 2014-10-17 11:13:20Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var DashboardComponentModel = require("./DashboardComponentModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        i18n = require("bundle!DashboardBundle"),
        _ = require("underscore");

    return DashboardComponentModel.extend({
        componentName: i18n['dashboard.component.value.component.name'],

        defaults: _.extend({}, DashboardComponentModel.prototype.defaults, {
           type: dashboardComponentTypes.VALUE,
           value: undefined
        }),

        initialize: function(attrs, options) {
            DashboardComponentModel.prototype.initialize.apply(this, arguments);

            this.on("change:value", this.notify, this);
            this.on("change:name", function(){
                this.set("label", this.get("name"), {silent:true});
            }, this);

            this.set("label", this.get("name"), {silent:true})
        },

        isVisible: function(){
            return false;
        },

        notify: function(){
            this.trigger(this.get("name"), this.get("value"));
            this.get("parentId") && this.collection.get(this.get("parentId")).notify();
        },

        acceptWiringVisitor: function(wiring){
            wiring.register(this, {
                signals: [ this.get("name") ],
                slots: {}
            });

            this.trigger(this.get("name"), this.get("value"));
        }
    });
});