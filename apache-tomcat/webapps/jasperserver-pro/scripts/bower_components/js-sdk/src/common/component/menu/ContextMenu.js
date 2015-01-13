/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
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
 * Context menu.
 *
 * @author: Andriy Godovanets
 * @version: $Id: ContextMenu.js 270 2014-10-13 19:58:03Z agodovanets $
 */

define(function (require) {
    "use strict";

    var Menu = require("./Menu"),
        $ = require("jquery"),
        json3 = require("json3"),
        _ = require("underscore");

    return Menu.extend({
        /**
         * @constructor ContextMenu
         * @classdesc Context menu that is shown at specified position.
         * @extends Menu
         * @param {array} options - Array containing objects with "label" and "action" properties, e.g. [ { label: "Save Dashboard", action: "save" } ].
         * @param {object} [additionalSettings] - Additional settings object. @see {@link Menu.js} for more information.
         * @throws "Menu should have options" error if no menu options were passed to constructor.
         * @fires option:<action> events when menu option is selected.
         * @example
         *  var contextMenu = new ContextMenu([ { label: "Save Dashboard", action: "save" } ]);
         */
        constructor: function(options, additionalSettings) {
            Menu.call(this, options, additionalSettings);

            this.topPadding = additionalSettings && additionalSettings.topPadding || 5;
            this.leftPadding = additionalSettings && additionalSettings.leftPadding || 5;

            _.bindAll(this, "_tryHide");
        },

        _tryHide: function() {
            this.hide();

            $(document.body).off("click.contextMenu", this._tryHide);
        },

        /**
         * @method show
         * @description Shows context menu at specified position.
         * @param {object} position - Position object.
         * @param {object} container - containment of context menu.
         * @param {number} position.left - Absolute position in px of context menu from left edge of the screen.
         * @param {number} position.top - Absolute position in px of context menu from top edge of the screen.
         * @param {number} position.padding - Padding with what context menu will be shown within container.
         * @throws Error if position object is missing or left/top properties are missing.
         */
        show: function(position, container) {
            if (!position || !_.isNumber(position.top) || !_.isNumber(position.left)) {
                throw new Error("Required params (top, left) missing: " + json3.stringify(position));
            }

            $(document.body).on("click.contextMenu", this._tryHide);

            var top = position.top,
                left = position.left,
                topPadding = this.topPadding,
                leftPadding = this.leftPadding,
                body = $("body"),
                menuElHeight = this.$el.height(),
                menuElWidth = this.$el.width(),
                containerHeight = container ?  container.height() : body.height(),
                containerWidth = container ? container.width() : body.width(),
                containerOffset = container ? container.offset() : body.offset(),
                fitByHeight = containerHeight - position.top,
                fitByWidth =  containerWidth - position.left;

            if(fitByHeight < menuElHeight){
                top = position.top - menuElHeight-topPadding;
                (top < containerOffset.top) && (top += containerOffset.top-top+topPadding);
                top = (top < 0) ? (containerHeight/2 - menuElHeight/2) : top
            }
            if(fitByWidth < menuElWidth){
                left = position.left - menuElWidth-leftPadding;
                (left < containerOffset.left) && (left += containerOffset.left-left+leftPadding);
                left = (left < 0) ? (containerWidth/2 - menuElWidth/2) : left
            }

            _.extend(this, {top: top, left: left});

            this.$el.css({ top: this.top, left: this.left });

            return Menu.prototype.show.apply(this, arguments);
        },

        /**
         * @method remove
         * @description Removes ContextMenu from DOM and removes events handlers from BODY.
         */
        remove: function() {
            $(document.body).off("click.contextMenu", this._tryHide);

            Menu.prototype.remove.apply(this, arguments);
        }
    });
});