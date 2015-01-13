/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: InputControlDashboardComponentModel.js 1008 2014-11-12 12:32:51Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var DashboardComponentModel = require("./DashboardComponentModel"),
        ValidationError = require("common/validation/ValidationErrorMessage"),
        ParametersCache = require("../../collection/ReportsParametersCollection").instance,
        i18n = require("bundle!DashboardBundle"),
        $ = require("jquery"),
        _ = require("underscore");

    function convertICDataToWiringInfo(model, parameters){
        var res = {
            signals: [ model.getOwnerParameterName() ],
            slots: {}
        };

        _.each(parameters, function(parameter){
            res.slots[parameter] = function(name){
                return function(value, sender){
                    model.trigger("signal", {
                        name: name,
                        value: value
                    }, sender);
                }
            }(parameter);
        });

        return res;
    }

    return DashboardComponentModel.extend({
        componentName: i18n['dashboard.component.input.control.component.name'],

        defaults: _.extend({}, DashboardComponentModel.prototype.defaults, {
           label: undefined
        }),

        validation: _.extend({}, DashboardComponentModel.prototype.validation, {
            label: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.component.error.filter.label.required")
                }
            ]
        }),


        initialize: function(attrs, options) {
            DashboardComponentModel.prototype.initialize.apply(this, arguments);

            this.on("change:value", this.notify, this);

            this.componentInitializedDfd = new $.Deferred();
        },

        isVisible: function(){
            return this.resource.resource.get("visible");
        },

        getOwnerUri: function(){
            return this.collection.findWhere({resource: this.get("ownerResourceId")}).resource.resource.get("uri");
        },

        getOwnerParameterName: function(){
            return this.get("ownerResourceParameterName");
        },

        notify: function(state){
            this.trigger(this.getOwnerParameterName(), state instanceof DashboardComponentModel ? this.get("value") : extractValuesFromStateModel(state));
            this.get("parentId") && this.collection.get(this.get("parentId")).notify();
        },

        acceptWiringVisitor: function(wiring){
            var self = this;
            wiring.register(this, convertICDataToWiringInfo(this, this.get("masterDependencies")));

            if (_.isUndefined(this.get("value"))){
                ParametersCache.getInputControlAsParameter(this.getOwnerUri(), this.getOwnerParameterName(), {full: this.get("fullCollectionRequired")})
                    .done(function(control){
                    self.trigger(self.getOwnerParameterName(), extractValuesFromRawState(control.state));
                    self.componentInitializedDfd.resolve();
                });
            } else {
                this.trigger(this.getOwnerParameterName(), this.get("value"));
                this.componentInitializedDfd.resolve();
            }
        }
    });

    function extractValuesFromStateModel(state) {
        return state.isValue ? [state.get("value")] :
            state.options.reduce(function(memo, option){
                option.get("selected") && memo.push(option.get("value"));
                return memo;
            }, []);
    }

    function extractValuesFromRawState(state) {
        return !state.options ? [state.value] :
            _.reduce(state.options, function(memo, option){
                option.selected && memo.push(option.value);
                return memo;
            }, []);
    }
});