/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: DashboardComponentModel.js 1058 2014-12-05 14:22:34Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        XRegExp = require('xregexp'),
        BackboneValidation = require("backbone.validation"),
        ValidationError = require("common/validation/ValidationErrorMessage"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        dashboardSettings = require("../../dashboardSettings");

    var DASHLET_ID_VALID_WORD_PATTERN = new RegExp(dashboardSettings.DASHLET_ID_VALID_WORD_PATTERN),
        ID_BLACK_LIST_CHARS_REG = new RegExp(dashboardSettings.DASHLET_ID_BLACK_LIST_CHARS_PATTERN, "g");

    /**
     * Iterate over array and return first truthy value returned after invocation
     *
     * @param array
     * @param iterator
     * @returns {*}
     */
    function _any(array, iterator) {
        var i, val, length = array.length;

        for (i = 0; i < length; i++) {
            val = iterator(array[i]);
            if (val) {
                return val;
            }
        }
    }

    /**
     * Generate valid identifier consisting from dasherized alfa-numeric chars.
     *
     * @param {string} str String taken to generate id from it
     * @returns {string} Sanitized identifier
     */
    function _identify(str) {
        // We should check whether name will be the valid identifier
        str = _.trim(str);
        if (!str.match(DASHLET_ID_VALID_WORD_PATTERN)) {
            return null;
        }
        // Sanitize string for id. White-listed symbols: spaces, dashes and alfa-numeric allowed only
        return str.replace(ID_BLACK_LIST_CHARS_REG, "_");
    }

    function _addIndex(str, i, delimiter) {
        return _.trim(str) + (i > 1 ? (delimiter || "_") + i : "");
    }

    var DashboardComponentModel = Backbone.Model.extend({
        defaults: {
            id: undefined,
            type: undefined,
            name: undefined,
            resource: undefined
        },

        validation: {
            name: [
                {
                    required: true,
                    msg: new ValidationError("dashboard.component.error.name.required")
                },
                {
                    fn: function(value, attr, computedState){
                        return this.collection.find(function(c) {
                            return c.get("name") == value && c.get("id") !== computedState.id;
                        });
                    },
                    msg: new ValidationError("dashboard.component.error.name.duplication")
                }
            ]
        },

        componentName: "Component",

        initialize: function (attrs, options) {
            if (!this.get("name")) {
                this.set("name", this.generateName());
            }

            if (!this.get("id")) {
                // By default id is generated from the component name.
                this.set("id", this.generateId());
            }

            options || (options = {});

            if (options.resource) {
                this.resource = options.resource;
            }
        },

        getChildren: function() {
            var self = this;

            return this.collection.filter(function(model) {
                return model.get("parentId") === self.get("id");
            });
        },

        getParent: function() {
            if (!this.has("parentId")) {
                return undefined;
            }

            return this.collection.findWhere({ id: this.get("parentId") });
        },

        generateName: function(name) {
            var simpleName = name || _.trim(this.get("label")) || this.componentName,
                id = _identify(this.get("type") === dashboardComponentTypes.INPUT_CONTROL && this.has("resourceId")
                    ? this.get("resourceId")
                    : simpleName),
                i;

            if (!id) {
                // Generate id from the component name when natural name couldn't be used as id.
                id = this.componentName;
                this.set("id", this.generateId(id));
            }
            i = this.generateIndex(simpleName, "name", " ");

            return _addIndex(simpleName, i, " ");
        },

        // Generate Id from the Natural Id that could be overridden. Fall back to name if natural id is not defined.
        generateId: function(name) {
            var id = _any([name, this.get("type") === dashboardComponentTypes.INPUT_CONTROL && this.has("resourceId")
                    ? this.get("resourceId")
                    : this.get("name"), this.componentName, this.get("type")], _identify),
                i = this.generateIndex(id, "id", "_");

            return _addIndex(id, i);
        },

        generateIndex: function(value, key, delimiter) {
            if (!this.collection) {
                return 1;
            }

            var i = 1;
            while(true) {
                // We add index counter only for i > 1
                var searchValue = value + (i > 1 ? delimiter + i : "");
                var criteria = {};
                criteria[key] = searchValue;
                if (this.collection.findWhere(criteria)) {
                    i++;
                } else {
                    break;
                }
            }
            return i;
        },

        isVisualization: function() {
            return this.get("type") === dashboardComponentTypes.REPORT
                || this.get("type") === dashboardComponentTypes.WEB_PAGE_VIEW
                || this.get("type") === dashboardComponentTypes.ADHOC_VIEW
                || this.get("type") === dashboardComponentTypes.TABLE
                || this.get("type") === dashboardComponentTypes.CHART
                || this.get("type") === dashboardComponentTypes.CROSSTAB;
        },

        isVisible: function(){
            return true;
        },

        isAutoRefreshable: function() {
            return this.has("autoRefresh") && this.has("refreshInterval") && this.has("refreshIntervalUnit");
        },

        acceptWiringVisitor : function(visitor){
            this._getWiringMetadata().done(visitor.register);
        },

        _getWiringMetadata: function(){
            var res = new $.Deferred();

            res.resolve(this, {signals: [], slots: {}});

            return res.promise();
        },

        clone: function() {
            var clone = Backbone.Model.prototype.clone.call(this);
            clone.collection = this.collection;
            return clone;
        },

        toJSON: function() {
            var data = Backbone.Model.prototype.toJSON.apply(this, arguments);

            // We doesn't persist Component selection state
            delete data.selected;

            return data;
        }
    });

    _.extend(DashboardComponentModel.prototype, BackboneValidation.mixin);

    return DashboardComponentModel;
});