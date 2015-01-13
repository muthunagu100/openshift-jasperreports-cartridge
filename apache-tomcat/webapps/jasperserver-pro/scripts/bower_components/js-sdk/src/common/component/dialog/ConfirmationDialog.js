/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Olesya Bobruyko
 * @version: $Id: ConfirmationDialog.js 380 2014-11-09 15:04:25Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Dialog = require("./Dialog"),
        confirmDialogTemplate = require("text!./template/confirmDialogTemplate.htm"),
        i18n = require('bundle!CommonBundle');

    return Dialog.extend({
        constructor: function(options) {
            Dialog.prototype.constructor.call(this, {
                modal: true,
                additionalCssClasses: "confirmationDialog",
                title: options.title,
                content: _.template(confirmDialogTemplate)({ text: options.text }),
                buttons: [
                    { label: i18n["button.ok"], action: "ok", primary: true },
                    { label: i18n["button.cancel"], action: "cancel", primary: false }
                ]
            });
        },

        initialize: function() {
            Dialog.prototype.initialize.apply(this, arguments);

            this.on("button:ok", this.close);
            this.on("button:cancel", this.close);
        }
    });
});
