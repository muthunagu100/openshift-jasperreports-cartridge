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
 * Menu that is shown near element when element is mouseovered.
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: HoverMenu.js 270 2014-10-13 19:58:03Z agodovanets $
 */

define(function (require) {
    "use strict";

    var AttachableMenu = require("./AttachableMenu"),
        _ = require("underscore");

    var TIME_BETWEEN_MOUSE_OVERS = 10;

    return AttachableMenu.extend({
        events: {
            "mouseover": "_onMenuMouseOver",
            "mouseout": "_onMenuMouseOut"
        },

        /**
        * @constructor HoverMenu
        * @classdesc Menu that is shown near element when element is mouseovered.
        * @extends AttachableMenu
        * @param {array} options - Array containing objects with "label" and "action" properties, e.g. [ { label: "Save Dashboard", action: "save" } ].
        * @param {jQuery|HTMLElement|selector} attachTo - Element to attach menu to.
        * @param {object} [additionalSettings] - Additional settings object. For more details on this see Menu.js
        * @throws "Menu should have options" error if no menu options were passed to constructor.
        * @fires option:<action> events when menu option is selected.
        * @example
        *  var hoverMenu = new HoverMenu([ { label: "Save Dashboard", action: "save" } ], $("#someElement"), { toggle: true });
        */
        constructor: function(options, attachTo, padding, additionalSettings) {
            this.padding = padding || {top: 0, left: 0};
            AttachableMenu.call(this, options, attachTo, this.padding, additionalSettings);

            _.bindAll(this, "_onElementMouseOver", "_onElementMouseOut");

            this.$attachTo.on("mouseover", this._onElementMouseOver);
            this.$attachTo.on("mouseout", this._onElementMouseOut);
        },

        _onMenuMouseOver: function() {
            this._menuHovered = true;
        },

        _onMenuMouseOut: function() {
            this._menuHovered = false;

            this._tryHide();
        },

        _onElementMouseOver: function() {
            if (this.$attachTo.is(":disabled")) {
                return;
            }

            this._elementHovered = true;

            if (!this.$el.is(":visible")) {
                this.show();
            }
        },

        _onElementMouseOut: function() {
            this._elementHovered = false;

            this._tryHide();
        },

        _tryHide: function() {
            setTimeout(_.bind(function() {
                if (!this._elementHovered && !this._menuHovered) {
                    this.hide();
                }
            }, this), TIME_BETWEEN_MOUSE_OVERS);
        },

        /**
         * @method remove
         * @description Removes HoverMenu from DOM and remove event handlers from element that menu is attached to.
         */
        remove: function() {
            this.$attachTo.off("mouseover", this._onElementMouseOver);
            this.$attachTo.off("mouseout", this._onElementMouseOut);

            AttachableMenu.prototype.remove.apply(this, arguments);
        }
    });
});