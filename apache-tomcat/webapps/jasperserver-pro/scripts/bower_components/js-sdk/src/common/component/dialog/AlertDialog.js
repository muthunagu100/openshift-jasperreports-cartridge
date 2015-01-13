/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Dialog = require("./Dialog"),
        alertDialogTemplate = require("text!./template/alertDialogTemplate.htm"),
        i18n = require('bundle!CommonBundle');

    return Dialog.extend({

        contentTemplate: _.template(alertDialogTemplate),

        constructor: function(options) {
            Dialog.prototype.constructor.call(this, {
                modal: true,
                additionalCssClasses: "alertDialog",
                title: i18n["dialog.exception.title"],
                buttons: [
                    { label: i18n["button.close"], action: "close", primary: true }
                ]
            });
        },

        initialize: function() {
            Dialog.prototype.initialize.apply(this, arguments);

            this.on("button:close", this.close);
        },

        setMessage: function(message) {
            this.content = this.contentTemplate({message: message});

            var rendered = this.renderContent();

            this.$contentContainer[typeof message === "string" ? "html" : "append"](rendered);
        }
    });
});
