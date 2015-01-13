/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: AddDashboardComponentDialogController.js 910 2014-10-24 09:06:20Z obobruyko $
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        addDashboardComponentDialogTitleFactory = require("dashboard/factory/addDashboardComponentDialogTitleFactory"),
        addDashboardComponentDialogTemplateFactory = require("dashboard/factory/addDashboardComponentDialogTemplateFactory"),
        Dialog = require("common/component/dialog/Dialog"),
        ViewWithRivets = require("common/view/ViewWithRivets"),
        i18n = require('bundle!DashboardBundle'),
        i18n2 = require('bundle!CommonBundle');

    function AddDashboardComponentDialogController(model, options) {
        var self = this;
        this.model = model;

        if (options && options.overElement) {
            this.lastHighestIndex = Dialog.highestIndex;
            Dialog.highestIndex = parseInt(options.overElement.css("zIndex")) + 1;
        }

        this.dialog = new Dialog({
            modal: true,
            model: model,
            additionalCssClasses: "addDashboardComponentDialog",
            title: addDashboardComponentDialogTitleFactory(model),
            content: new ViewWithRivets({ template: addDashboardComponentDialogTemplateFactory(model), model: model, i18n: i18n }),
            buttons: [
                {
                    label: i18n2[(options && options.okButtonLabel) ? options.okButtonLabel : "button.ok"],
                    action: "ok", primary: true, triggerOnKeyCode: 13
                },
                {
                    label: i18n2["button.cancel"],
                    action: "cancel", primary: false,
                    triggerOnKeyCode: 27
                }
            ]
        });

        this.dialog.listenTo(this.dialog.content.model, "validated:valid", function(){
            this.enableButton("ok");
        });

        this.dialog.listenTo(this.dialog.content.model, "validated:invalid", function(){
            this.disableButton("ok");
        });

        this.dialog.on("dialog:visible", function(){
            var input = this.$el.find("input");
            var inputVal = input.val();
            // necessary to set caret properly if some text already in the input
            input.focus().val("").val(inputVal);
        });

        options && options.okButtonDisabled && this.dialog.disableButton("ok");
    }

    AddDashboardComponentDialogController.prototype.remove = function() {
        this.dialog.off("dialog:visible");
        this.dialog.remove();
    };

    AddDashboardComponentDialogController.prototype.closeAndRemove = function() {
        Dialog.resetHighestIndex(this.lastHighestIndex);
        this.dialog.close();
        this.remove();
    };

    return AddDashboardComponentDialogController;
});