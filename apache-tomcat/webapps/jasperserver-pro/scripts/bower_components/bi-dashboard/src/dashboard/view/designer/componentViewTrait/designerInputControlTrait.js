/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: designerInputControlTrait.js 970 2014-11-05 09:46:16Z ktsaregradskyi $
 */

define(function(require) {
    "use strict";

    var inputControlTrait = require("../../base/componentViewTrait/inputControlTrait"),
        dashboardMessageBus = require("dashboard/dashboardMessageBus"),
        dashboardMessageBusEvents = require("dashboard/enum/dashboardMessageBusEvents"),
        ParametersCache = require("../../../collection/ReportsParametersCollection").instance,
        _ = require("underscore"),
        $ = require("jquery");

    return _.extend({}, inputControlTrait, {
        _onViewInitialize: function() {
            var self = this;

            inputControlTrait._onViewInitialize.apply(this, arguments);

            // When we go yo preview mode, ICs with radio buttons get checked on preview canvas, that's why nothing is selected when we
            // go back to designer mode. That's why we need to fix selection on radio buttons when we get back to designer mode.
            this.listenTo(dashboardMessageBus, dashboardMessageBusEvents.TOGGLE_PREVIEW_MODE, function(previewModeEnabled) {
                if (!previewModeEnabled) {
                    for (var viewName in self.component.controlViews) {
                        if (self.component.controlViews[viewName].model.get("type") === "singleSelectRadio") {
                            self.component.controlViews[viewName].updateOptionsSelection();
                        }
                    }
                }
            });
        },

        _initComponent: function() {
            var self = this;

            inputControlTrait._initComponent.apply(this, arguments);

            this.listenTo(this.component, "controls:rendered", this._addOverlay);

            this.listenTo(ParametersCache, "change", function(model){
                if (model.id === self.model.getOwnerUri()){
                    self.reset();
                }
            });
        },

        _addOverlay: function() {
            this.$overlay = $("<div/>", {"class": "overlay"});

            this.$el.prepend(this.$overlay);
        },

        _onComponentPropertiesChange: function () {
            var changedAttrs = this.model.changedAttributes(),
                model = this.inputControlCollection.models[0];

            if (changedAttrs && "label" in changedAttrs) {
                model && model.set({label: this.model.get("label")});
                this.component.render();
            }
        },

        reset: function(){
            var self = this,
                args = arguments;

            if (this.inputControlCollection.models && this.inputControlCollection.models.length > 0){
                inputControlTrait.reset.apply(this, arguments);
            } else {
                ParametersCache.getReportParameters(this.model.getOwnerUri()).done(function(params){
                    var control = _.findWhere(params, { id: self.model.getOwnerParameterName()});
                    if (control){
                        var preparedControl = _.extend({}, control, {
                            label: self.model.get("label") || control.label,
                            slaveDependencies: [],
                            state: {}
                        });

                        self.inputControlCollection.reset([preparedControl]);
                    }
                    inputControlTrait.reset.apply(self, args);
                }).fail(function(){
                    inputControlTrait.reset.apply(self, args);
                });
            }
        }
    });
});