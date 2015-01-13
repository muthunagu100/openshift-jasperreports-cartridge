/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: WiringProducerViewModel.js 867 2014-10-20 08:48:05Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        DashboardWiringModel = require("./../DashboardWiringModel"),
        ValidationError = require("common/validation/ValidationErrorMessage"),
        WiringConsumerViewModel = require("./WiringConsumerViewModel"),
        BackboneValidation = require("backbone.validation"),
        WiringConsumerViewModelCollection = require("../../collection/filterManager/WiringConsumerViewModelCollection");

    var WiringProducerModel = Backbone.Model.extend(_.extend({}, BackboneValidation.mixin, {
        defaults: {
            id: undefined,
            name: undefined,
            parameter: undefined
        },

        validation: {
            name: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.filterManager.error.parameter.name.required")
                },
                {
                    fn: function(value, attr, computedState){
                        if (!_.isUndefined(computedState.id)) {
                            return;
                        }

                        return this.collection.find(function(c) {
                            return c.get("name") == value && c.get("id") !== computedState.id;
                        });
                    },
                    msg: new ValidationError("dashboard.filterManager.error.parameter.name.duplication")
                }
            ]
        },

        initialize: function(attrs, options) {
            options || (options = {});

            this.consumers = options.consumers || new WiringConsumerViewModelCollection([]);
            this.component = options.component;
        },

        isValid: function(validate) {
            return BackboneValidation.mixin.isValid.call(this, validate) && this.consumers.isValid(validate);
        },

        isHidden: function() {
            return !this.component.isVisible();
        }
    }), {
        createFromDashboardWiringModel: function(dashboardWiringModel, components) {
            var consumers = new WiringConsumerViewModelCollection();

            consumers.add(dashboardWiringModel.consumers.map(function(consumerModel) {
                var consumerParts = consumerModel.get("consumer").split(":"),
                    consumerComponentModel = components.get(consumerParts[0]);

                return new WiringConsumerViewModel({
                    id: consumerParts[0],
                    parameter: consumerParts[1],
                    name: consumerComponentModel.get("name")
                }, {
                    component: consumerComponentModel,
                    collection: consumers
                });
            }));

            return new WiringProducerModel({
                id: dashboardWiringModel.component.get("id"),
                name: dashboardWiringModel.component.get("label"),
                parameter: dashboardWiringModel.get("name")
            }, {
                component: dashboardWiringModel.component,
                consumers: consumers
            });
        }
    });

    return WiringProducerModel;
});
