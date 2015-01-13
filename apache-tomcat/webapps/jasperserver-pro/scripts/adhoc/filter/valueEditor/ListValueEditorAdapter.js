/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: ListValueEditorAdapter.js 6614 2014-08-21 07:48:05Z yuriy.plakosh $
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        AbstractValueEditor = require("adhoc/filter/valueEditor/AbstractValueEditor"),
        OlapFilterValueFormatter = require("adhoc/filter/format/OlapFilterValueFormatter"),
        filterValueFormatter = require("adhoc/filter/format/filterValueFormatter"),
        SingleSelect = require("common/component/singleSelect/view/SingleSelectNew"),
        adhocFilterSettings = require("settings!adhocFilterSettings");

    return AbstractValueEditor.extend({
        tagName: "div",
        className: "values",

        initialize : function(options) {
            adhocFilterSettings = _.defaults(adhocFilterSettings || {}, {
                preloadAvailableValuesOlap: "false",
                preloadAvailableValues: "true"
            });

            this.list = this.createList();
            AbstractValueEditor.prototype.initialize.apply(this, arguments);
        },

        createList: function() {
            return new SingleSelect({
                getData: _.bind(this.model.dataProvider.getData, this.model),
                formatValue: this.model.isOlap
                    ? new OlapFilterValueFormatter(this.model.get("isFirstLevelInHierarchyAll")).format
                    : filterValueFormatter
            });
        },

        registerEvents : function() {
            this.listenTo(this.list, "selection:change", _.bind(function(selection, options) {
                options && this.model.set("isAnyValue", options.isTrueAll, { silent: true });
                this.setValue(_.isArray(selection) ? _.reject(selection, function(item) { return item == undefined; }) : selection);
            }, this));
        },

        render : function() {
            this.$el.empty();
            // Widget in our case is rendered first with default label "Select one..."
            // we don't want to show this label first, so we will hide widget until real value is set
            this.list.$el.hide();

            this.$el.append(this.list.el);
            this.$el.append('<span class="message warning" data-validation-field="value"></span>');
            this.list.render();

            return this;
        },

        renderData : function() {
            this.list.renderData();
        },

        _setValueToList: function(options) {
            this.list.setValue(this.getValue(), options);
        },

        _loadAvailableValuesImmediately: function() {
            return this.model.isOlap
                ? (adhocFilterSettings.preloadAvailableValuesOlap === "true")
                : (adhocFilterSettings.preloadAvailableValues === "true");
        },

        _removeAvailableData: function() {
            //remove available data only for OLAP
            if (this.model.isOlap) {
                //clear al cached data
                this.model.removeAvailableData();

                //tell list to reset to the initial state
                this.list.reset({silent: true});
            }
        },

        updateData: function() {
            this._removeAvailableData();

            var options = {};

            if (this._loadAvailableValuesImmediately()) {
                //This is necessary to silently load first n-elements
                this.model.setShowLoading(false);
                this.list.once("selection:change", _.bind(this.model.setShowLoading, this.model, true));

            } else {
                options = {
                    modelOptions: {silent: true}
                }
            }

            this._setValueToList(options);

            this.list.$el.show(); //why do we need direct access to list's el property?
            this.trigger("rendered", this);
        },

        remove : function() {
            this.removeView();
            AbstractValueEditor.prototype.remove.call(this);
            this.list.remove();
        }
    });
});
