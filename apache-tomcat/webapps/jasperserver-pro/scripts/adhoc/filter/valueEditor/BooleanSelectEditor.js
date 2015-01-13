/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: BooleanSelectEditor.js 6614 2014-08-21 07:48:05Z yuriy.plakosh $
 */

define(function(require) {
    "use strict";

    var AbstractValueEditor = require("adhoc/filter/valueEditor/AbstractValueEditor"),
        _ = require("underscore");

    return AbstractValueEditor.extend({
        inputSelector : "select",
        isMultiple: false,

        getDefaultViewModel : function() {
            return {
                multiple: this.isMultiple,
                options: [
                    { value: "false", label: "false" },
                    { value: "true", label: "true" }
                ]
            };
        },

        serializeModel: function() {
            var viewModel = this.getDefaultViewModel(),
                value = (this.getValue() || ""),
                selected;

            if (selected = _.find(viewModel.options, function(opt) { return opt.value === value;})) {
                selected.selected = true
            }

            return viewModel;
        },

        events : function() {
            var eventsObj = {};

            eventsObj["change " + this.inputSelector] = "onChange";

            return eventsObj;
        },

        onChange : function() {
            var selected = this.$(this.inputSelector).val(),
                converted = this.convert(selected);
            this.setValue(converted);
        }
    });
});
