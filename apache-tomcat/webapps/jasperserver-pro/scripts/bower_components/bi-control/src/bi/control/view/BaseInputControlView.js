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
 * @version: $Id: BaseInputControlView.js 115 2014-11-12 12:16:57Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),
        $ = require("jquery"),
        domReady = require("domReady"),
        Mustache = require("mustache"),
        log = require("logger").register(module),
        i18n = require("bundle!jasperserver_messages");

    return Backbone.View.extend({
        constructor: function(options) {
            if (!options || !options.model || !(options.model instanceof Backbone.Model)) {
                throw new Error ("View should have associated Backbone.Model");
            }

            Backbone.View.apply(this, arguments);
        },

        initialize: function(options) {
            //make i18n accessible from template's scope
            this.i18n = i18n;
            this.renderStructure();
            this.renderState();
            this.model.get("visible") && this.bindCustomEventListeners();

            this.model.state.on("reset change", this.updateWarningMessage, this);
            this.model.on("change:label", this.reRender, this);
            this.updateWarningMessage();
        },

        renderStructure: function() {
            this.$el = $(Mustache.to_html((this.template || ""), this.model.toJSON()));
            return this;
        },
        renderState: function() {
            this.updateValue(this.model.state.get("value"));
        },

        updateValue: function() {
        },

        bindCustomEventListeners: function () {
        },

        enable: function() {

            // if this component based on more complex component, let's call their enable functions
            if (this.multiSelect) {
                this.multiSelect.setDisabled(false);
                return;
            }
            if (this.singleSelect) {
                this.singleSelect.setDisabled(false);
                return;
            }

            this.$el.find("input, select").prop('disabled', false);
        },

        disable: function() {

            // if this component based on more complex component, let's call their disable functions
            if (this.multiSelect) {
                this.multiSelect.setDisabled(true);
                return;
            }
            if (this.singleSelect) {
                this.singleSelect.setDisabled(true);
                return;
            }

            this.$el.find("input, select").prop('disabled', true);
        },

        updateWarningMessage: function() {
            var message = this.model.state.get("error") != null ? this.model.state.get("error") : "";
            this.$el.find(".warning").text(message);
        },

        makeResizable: function() {
        },
        remove: function() {
            this.model.state.off("reset change:error", this.updateWarningMessage, this);
            Backbone.View.prototype.remove.call(this);
        },

        reRender: function () {
            this.renderStructure();
            this.model.get("visible") && this.bindCustomEventListeners();
        },

        getAmountOfLinesToDisplay: function() {
            var minimumAmountOfMultiSelectLines = 3,
                linesToDisplay = this.model.get("linesToDisplay") || minimumAmountOfMultiSelectLines;

            linesToDisplay = Math.max(linesToDisplay, minimumAmountOfMultiSelectLines);

            return linesToDisplay;
        }
    });

});