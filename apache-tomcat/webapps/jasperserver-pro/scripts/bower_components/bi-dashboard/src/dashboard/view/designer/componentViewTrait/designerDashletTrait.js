/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: designerDashletTrait.js 981 2014-11-07 15:05:29Z obobruyko $
 */

define(function(require, exports, module) {
    "use strict";

    var dashletTrait = require("../../base/componentViewTrait/dashletTrait"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        PropertiesDialogController = require("dashboard/view/designer/propertiesDialog/PropertiesDialogController"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        ContextMenu = require("common/component/menu/ContextMenu"),
        _ = require("underscore"),
        $ = require("jquery"),
        log = require("logger").register(module);

    function setDataAttributes($el, componentModel) {
        var attrs = ["x", "y", "width", "height"];

        _.each(attrs, function(attr) {
            $el.attr("data-" + attr, componentModel.get(attr));
        });

        $el.attr(dashboardSettings.COMPONENT_ID_ATTRIBUTE, componentModel.id);
    }

    return _.extend({}, dashletTrait, {
        _onViewInitialize: function() {
            dashletTrait._onViewInitialize.apply(this, arguments);

            this.listenTo(this.model, "change:x change:y", this._onComponentMove);
            this.listenTo(this.model, "change:width change:height", this._onComponentResize);
        },

        _onViewRemove: function() {
            dashletTrait._onViewRemove.apply(this, arguments);

            this.$content.off("mousedown");
        },

        _onPropertiesChange: function() {
            var changedAttrs = this.model.changedAttributes();

            if(changedAttrs && ("showTitleBar" in changedAttrs || "showRefreshButton" in changedAttrs || "showMaximizeButton" in changedAttrs)) {
                this._setDashletToolbarVisualAppearance(changedAttrs);
            }

            this._onComponentPropertiesChange && this._onComponentPropertiesChange();
        },

        _onComponentResize: function() {
            this.$el.parent().css(this.model.getCssPosition());
            setDataAttributes(this.$el.parent(), this.model);

            this.resize();

            log.debug("resized dashlet " + this.model.id);
        },

        _onComponentMove: function() {
            this.$el.parent().css(this.model.getCssPosition());
            setDataAttributes(this.$el.parent(), this.model);

            log.debug("moved dashlet " + this.model.id);
        },

        _onDashboardPropertiesChange: function(model) {
            var changedAttrs = model.changedAttributes();

            if (changedAttrs && ("showDashletBorders" in changedAttrs || "dashletPadding" in changedAttrs || "dashletMargin" in changedAttrs)) {
                this._setDashletVisualAppearance();
                this.resize();
            }
        },

        _addOverlay: function() {
            if(this.model.get("type") !== dashboardComponentTypes.FILTER_GROUP) {
                if(!this.$overlay){
                    this.$overlay = $("<div></div>").addClass("overlay");

                    this.$dashlet.prepend(this.$overlay);
                    // Firefox issue - mousedown on scrollbar fires DOM event, which is not desired for us
                    this.$content.on("mousedown", function(ev){
                        ev.stopPropagation();
                    });
                }

                this._fitOverlay();
            }
        },

        _fitOverlay: function(){

            this.$overlay.height(this.$dashlet.outerHeight(true));
            this.$overlay.width(this.$dashlet.outerWidth(true));

            try {
                var marginLeft = parseInt(this.$el.css("padding-left"), 10),
                    borderWidth = parseInt(this.$dashlet.css("border-width"), 10);

                this.$overlay.css({
                    "margin-left": ((isNaN(marginLeft) ? 0 : marginLeft) + (isNaN(borderWidth) ? 0 : borderWidth)) + "px"
                });
            } catch(ex) {}
        },

        _toggleDashletToolbarButtons: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").disable();
                this.toolbar.getOptionView("maximize").disable();
            }
        }
    });
});