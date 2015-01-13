/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function (require) {
    "use strict";

    var _ = require("underscore"),
        i18n = require('bundle!DashboardBundle'),
        i18n2 = require('bundle!CommonBundle'),
        ClassUtil = require('common/util/classUtil'),
        fonts = require("dashboard/enum/fonts"),
        fontSizes = require("dashboard/enum/fontSizes"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        propertiesTemplateFactory = require("dashboard/factory/propertiesTemplateFactory"),
        PropertiesDialogView = require("./view/PropertiesDialogView"),
        propertiesTitleFactory = require("dashboard/factory/propertiesTitleFactory"),
        Dialog = require("common/component/dialog/Dialog"),
        dashboardMessageBus = require("../../../dashboardMessageBus"),
        dashboardMessageBusEvents = require("../../../enum/dashboardMessageBusEvents"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var PropertiesDialog = Dialog.extend({
        events: _.extend({
            "mousedown .header.mover, .subcontainer, .footer": "_onPropertiesDialogSelect"
        }, Dialog.prototype.events),

        open: function() {
            this.content.model.set(this.content.original.clone().attributes);
            this.content.originalState.set(this.content.original.clone().attributes);

            Dialog.prototype.open.apply(this, arguments);

            this.content.model.validate();
        },

        _onPropertiesDialogSelect: function(){
            this.trigger("properties:dialog:select", this);
        }
    });

    var getFonts = function(model){
        return (model.get("type") === dashboardComponentTypes.FREE_TEXT) ? fonts : []
    };

    var getAutoRefreshTitle = function(model) {
        return model.get("type") === dashboardComponentTypes.DASHBOARD_PROPERTIES ?
            i18n["dashboard.dialog.properties.auto.refresh"] : i18n["dashboard.dashlet.dialog.properties.auto.refresh"];
    };

    var getAdditionalCssClasses = function(model) {
      var classes = "dashboardLevelPropertiesDialog " + model.get("type") + "Dialog";
      if (model.get("type") !== dashboardComponentTypes.DASHBOARD_PROPERTIES) {
        classes += " dashletLevelPropertiesDialog";
      }
      return classes
    };
 
    return ClassUtil.extend({
        constructor: function(model){
            this.dialog = new PropertiesDialog({
                model: model,
                additionalCssClasses: getAdditionalCssClasses(model),
                title: propertiesTitleFactory(model),
                content: new PropertiesDialogView({
                    template: propertiesTemplateFactory(model),
                    i18n: i18n,
                    model: model,
                    autoRefreshTitle: getAutoRefreshTitle(model),
                    fonts: getFonts(model),
                    fontSizes: fontSizes
                }),
                buttons: [
                    { label: i18n2["button.apply"], action: "apply", primary: true },
                    { label: i18n2["button.ok"], action: "ok", primary: false },
                    { label: i18n2["button.cancel"], action: "cancel", primary: false }
                ]
            });

            this.initialize();
        },

        initialize: function(){
            this._initEvents();
            this.dialogIsOpened = false;
        },

        onDialogApply: function(){
            this.applyModel();
        },

        onDialogOk: function(){
            this.rollbackModel({silent: true});
            this.applyModel();
            this.saveModel();
            Dialog.prototype.close.apply(this.dialog, arguments);
        },

        onDialogCancel: function(){
            this.rollbackModel();
            Dialog.prototype.close.apply(this.dialog, arguments);
        },

        saveModel: function(){
            var originalState = this.dialog.content.originalState;

            if (this.dialog.content.original.hasChanged()) {
                originalState.set(this.dialog.content.original.toJSON());
                dashboardMessageBus.trigger(dashboardMessageBusEvents.SAVE_DASHBOARD_STATE);
            }
        },

        applyModel: function(){
            if (this.dialog.content.model.isValid(true)) {
                this.dialog.content.original && this.dialog.content.original.set(this.dialog.content.model.attributes);
            }
        },

        rollbackModel: function(options){
            var options  = options || {};
            var original = this.dialog.content.original;
            var originalState = this.dialog.content.originalState;

            var originalStateJSON = originalState.toJSON();

            options.silent ? original.set(originalStateJSON, {silent: true}) : original.set(originalStateJSON);
        },

        toggleDialogStateProps: function(prop){
            this[prop] ? (this[prop] = false) : (this[prop] = true);
        },

        _initEvents: function(){
            var self = this;

            this.dialog.on("open", function(){
                self.toggleDialogStateProps("dialogIsOpened");
            });

            this.dialog.on("close", function(){
                self.toggleDialogStateProps("dialogIsOpened");
            });

            this.dialog.on("button:cancel", _.bind(this.onDialogCancel, this));
            this.dialog.on("button:apply", _.bind(this.onDialogApply, this));
            this.dialog.on("button:ok", _.bind(this.onDialogOk, this));
        },

        remove: function(){
            this.dialog.content.remove();
            this.dialog.off("button:cancel");
            this.dialog.off("button:apply");
            this.dialog.off("button:ok");
            this.dialog.off("open");
            this.dialog.off("close");
            this.dialog.remove();
        }
    });
});
