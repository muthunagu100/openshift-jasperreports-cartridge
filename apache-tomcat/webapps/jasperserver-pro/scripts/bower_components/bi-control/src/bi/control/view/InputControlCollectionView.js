/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id: InputControlCollectionView.js 107 2014-11-09 14:57:52Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var
        $ = require("jquery"),
        _ = require("underscore"),
        Backbone = require("backbone"),
        domReady = require("domReady"),
        inputControlTypeViews = require("../enum/uiTypes"),
        log = require("logger").register(module);


    return Backbone.View.extend({

        el: "<div style='height: 100%;'></div>",

        $icContainer: false,
        $icList: false,

        initialize: function(options) {
            this.stateModel = options.stateModel;

            this.uiTypes = inputControlTypeViews;
            this.controlViews = {};

            // initialize this variable to prevent errors then setContainer() function was not used
            this.containerAttachedToDOM = new $.Deferred();

            // set the relative position to the our $el element
            this.$el.css("position", "relative");

            this.collection.on("reset", this._createControlViews, this);
            this.collection.on("disableICs", this._disableICs, this);
            this.collection.on("enableICs", this._enableICs, this);
        },

        _createControlViews: function() {
            var that = this;
            this.controlViews = {};
            that.collection.each(_.bind(that._createControlView, that));
            that.render();
        },

        // Create control and add it to controlViews but do not add to the DOM
        _createControlView:function (control) {
            var type = control.get("type"),
                id = control.get("id");

            if (_.has(this.uiTypes, type)) {
                if (control.get("visible")) {
                    this.controlViews[id] = new this.uiTypes[type]({
                        model: control
                    });
                }
            } else {
                throw new Error("Can not find implementation of the control type: " + type);
            }
            return this.controlViews[id];
        },

        setContainer: function(selector) {

            var $icContainer = $(selector), self = this;

            if (!$icContainer.length) {
                return;
            }

            $icContainer.empty();

            this.$icContainer = $icContainer;

            // next, wait for the domReady event and append our $el into the container
            this.containerAttachedToDOM = new $.Deferred();
            domReady(function() {

                var $icContainer = self.$icContainer;

                $icContainer.html(self.$el);

                self.containerAttachedToDOM.resolve();
            });
        },

        render: function() {
            var self = this,
                dfd = new $.Deferred();

            this.containerAttachedToDOM.done(function() {

                self.$el.empty();

                self.$icList = $("<div class='list inputControls'></div>");

                self.$el.append(self.$icList);

                self._renderControls();

                dfd.resolve();
            });

            return dfd;
        },

        _renderControls: function() {
            var self = this;

            this.collection.each(function(control) {
                if (self.controlViews[control.get("id")]) {
                    self.$icList.append(self.controlViews[control.get("id")].$el);
                }
            });

            this.trigger("controls:rendered");
        },

        // Prevent user action on control
        disable:function () {
            _.pluck(this.controlViews, "disable");
        },

        // Allow user action on control
        enable:function () {
            _.pluck(this.controlViews, "enable");
        },

        _disableICs: function(ICsToDisable) {
            var self = this;
            _.each(ICsToDisable, function(icId) {
                if (self.controlViews[icId]) {
                    self.controlViews[icId].disable();
                }
            });
        },

        _enableICs: function(ICsToEnable) {
            var self = this;
            _.each(ICsToEnable, function(icId) {
                if (self.controlViews[icId]) {
                    self.controlViews[icId].enable();
                }
            });
        },

        remove: function() {
            _.pluck(this.controlViews, "remove");
            this.collection.off("reset", this._createControlViews, this);
            Backbone.View.prototype.remove.call(this);
        }
    });
});