/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: FilterGroupView.js 904 2014-10-23 13:29:47Z tbidyuk $
 */

define(function(require) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        Backbone = require("backbone"),
        i18n = require("bundle!CommonBundle"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        filterGroupButtonsTemplate = require("text!../../template/filterGroupButtonsTemplate.htm"),
        domReady = require("domReady");

    var ATTRIBUTES = {
            APPLY: "applyButton",
            RESET: "resetButton",
            FILTERS_PER_ROW: "filtersPerRow",
            BUTTONS_POSITION: "buttonsPosition"
        },
        FILTER_ROW_CLASS = "filterRow",
        FILTER_ROW_FLUID = "fluid",
        BUTTONS_FIXED = "fixed",
        BUTTONS_POSITION_RIGHT = "right",
        ONE_BUTTON_CLASS = "oneButton";

    return Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.model, "change", this._onPropertiesChange);
        },

        render: function() {
            this.$footer = this.$el.parent().append(_.template(filterGroupButtonsTemplate, { i18n: i18n })).find(".filterGroupButtons");

            this.$applyButton = this.$footer.find("> ." + ATTRIBUTES.APPLY);
            this.$resetButton = this.$footer.find("> ." + ATTRIBUTES.RESET);

            this.$applyButton.on("click", _.bind(this.model.notify, this.model, true));
            this.$resetButton.on("click", _.bind(this._onResetClick, this));

            this._setButtonsVisibility();
        },

        remove: function(){
            this.$applyButton && this.$applyButton.off("click");
            this.$resetButton && this.$resetButton.off("click");

            return Backbone.View.prototype.remove.apply(this, arguments);
        },

        /**
         * Changes ICs width to put necessary amount of them in one row
         */
        resizeInputControlsWidth: function() {
            var filtersPerRow = this.model.get(ATTRIBUTES.FILTERS_PER_ROW),
                diff = this.$el.width() / this.$el.outerWidth() * 100,
                percentageWidth = Math.floor(diff / filtersPerRow) + "%";

            this.$el.find(".inputControlWrapper").css({width: percentageWidth});
        },

        /**
         * Wrap input controls into div.
         */
        wrapInputControls: function() {
            var filtersPerRow = this.model.get(ATTRIBUTES.FILTERS_PER_ROW),
                $inputControls = this.$el.find(".inputControlWrapper"),
                inputControlsCount = $inputControls.length;

            this.removeEmptyRows();

            this.unwrapInputControls($inputControls);

            for (var i = 0; i < inputControlsCount; i += filtersPerRow) {
                var $row = $("<div/>", {"class": FILTER_ROW_CLASS }),
                    $inputControlsInRow = $inputControls.filter(function(index) {
                        return index >= i && index < i + filtersPerRow;
                    });

                $inputControlsInRow.wrapAll($row);
            }
        },

        refresh: function(){
            this.wrapInputControls();
            this.refreshFilterGroupLayout(this.model.get(ATTRIBUTES.BUTTONS_POSITION));
        },

        /**
         * Unwrap input controls.
         * @param $inputControls[jQuery Object] - collection of input controls.
         */
        unwrapInputControls: function($inputControls){
            $inputControls = $inputControls || this.$el.find(".inputControlWrapper");

            _.each($inputControls, function(inputControl) {
                $(inputControl).parent().hasClass(FILTER_ROW_CLASS) && $(inputControl).unwrap();
            });
        },

        /**
         * Removes empty div(.filterGroup).
         */
        removeEmptyRows: function() {
            var $rows = this.$el.find("." + FILTER_ROW_CLASS);

            _.each($rows, function(row) {
                !$(row).children().length && $(row).remove();
            });
        },

        refreshFilterGroupLayout: function(position){
            var $filterGroups =  this.$el.find("." + FILTER_ROW_CLASS),
                parentHeight = this.$el.parent().height(),
                elPadding = this.$el.css("padding");

            if(position === BUTTONS_POSITION_RIGHT && this.$footer.is(":visible")){
                $filterGroups.addClass(FILTER_ROW_FLUID);
                this.$footer.addClass(BUTTONS_FIXED);
                this.$el.css({
                    float: "left",
                    height: (parentHeight  - elPadding*2) + "px"
                });

                if(this.model.get(ATTRIBUTES.APPLY) && this.model.get(ATTRIBUTES.RESET)) {
                    this.$footer.removeClass(ONE_BUTTON_CLASS);
                    $filterGroups.removeClass(ONE_BUTTON_CLASS);
                }else{
                    this.$footer.addClass(ONE_BUTTON_CLASS);
                    $filterGroups.addClass(ONE_BUTTON_CLASS);
                }

            }else{
                $filterGroups.removeClass(FILTER_ROW_FLUID).removeClass(ONE_BUTTON_CLASS);
                this.$footer.removeClass(ONE_BUTTON_CLASS).removeClass(BUTTONS_FIXED);
                this.$el.css({
                    float: "none",
                    height: this.$footer.is(":visible") ? (parentHeight  - this.$footer.outerHeight(true)) + "px" : parentHeight
                });
            }
        },

        enableButtons: function() {
            this.$applyButton && this.$applyButton.removeAttr("disabled");
            this.$resetButton && this.$resetButton.removeAttr("disabled");
        },

        disableButtons: function() {
            this.$applyButton && this.$applyButton.attr("disabled", "disabled");
            this.$resetButton && this.$resetButton.attr("disabled", "disabled");
        },

        _onResetClick: function(){
            var id = this.model.id;
            _.each(this.componentViews, function (view) {
                var parent = view.model.getParent();
                parent && parent.id === id && view.reset();
            });

            this.model.notify(true);
        },

        _onPropertiesChange: function() {
            var changedAttrs = this.model.changedAttributes();

            if (changedAttrs) {
                if (ATTRIBUTES.APPLY in changedAttrs || ATTRIBUTES.RESET in changedAttrs) {
                    this._setButtonsVisibility();
                    this.refreshFilterGroupLayout(this.model.get(ATTRIBUTES.BUTTONS_POSITION));
                }

                if (ATTRIBUTES.FILTERS_PER_ROW in changedAttrs) {
                    this.resizeInputControlsWidth();
                    this.refresh();
                }

                if(ATTRIBUTES.BUTTONS_POSITION in changedAttrs){
                    this.refreshFilterGroupLayout(changedAttrs[ATTRIBUTES.BUTTONS_POSITION]);
                }
            }
        },

        _setButtonsVisibility: function() {
            _.each(ATTRIBUTES, function(buttonName) {
                this["$" + buttonName] && this._setButtonVisibility(buttonName);
            }, this);

            (this.model.get(ATTRIBUTES.APPLY) || this.model.get(ATTRIBUTES.RESET)) ? this.$footer.show() : this.$footer.hide();
        },

        _setButtonVisibility: function(buttonName) {
            var $button = this["$" + buttonName];

            this.model.get(buttonName) ? $button.show() : $button.hide();
        }
    });
});