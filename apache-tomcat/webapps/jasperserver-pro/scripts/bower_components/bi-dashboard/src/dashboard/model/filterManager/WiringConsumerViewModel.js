/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: WiringConsumerViewModel.js 670 2014-09-19 09:17:26Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        ValidationError = require("common/validation/ValidationErrorMessage");

    require("backbone.validation");

    return Backbone.Model.extend(_.extend({}, Backbone.Validation.mixin, {
        idAttribute: undefined,

        defaults: {
            id: undefined,
            name: undefined,
            parameter: undefined
        },

        validation: {
            id: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.filterManager.error.component.required")
                }
            ],

            parameter: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.filterManager.error.parameter.required")
                }
            ]
        },

        initialize: function(attrs, options) {
            options || (options = {});

            this.component = options.component;

            this.on("change:id", function() { this.set("parameter", undefined); }, this);
        }
    }));
});
