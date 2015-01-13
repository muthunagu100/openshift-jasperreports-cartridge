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
 * @author: Andriy Godovanets, Kostiantyn Tsaregradskyi
 * @version: $Id: cascadingMenuTrait.js 270 2014-10-13 19:58:03Z agodovanets $
 */

define(function (require) {
    "use strict";

    var Menu = require("./Menu"),
        HoverMenu = require("./HoverMenu"),
        _ = require("underscore");

    /**
     * @description Object that extends any Menu component with options cascade. Adds support of "children" property for "options" param.
     * @example
     *  var CascadingContextMenu = ContextMenu.extend(cascadingMenuTrait);
     *  var cascadingContextMenu = new CascadingContextMenu([
     {
         label: "Remove Summary", action: "removeSummary"
     },
     {
         label: "Change Function",
         children: [
             { label : "Distinct Count", action: "distinctCount" },
             { label : "Count All", action: "countAll" }
         ]
     }
     ], "#someElement", { toggle: true });
     */
    var cascadingMenuTrait =  {
        _onInitialize: function(options) {
            this.on("mouseover", _.bind(this._showSubMenu, this))
        },

        _showSubMenu: function(optionView) {
            if (optionView.model.has("children")) {
                var subView = this._getSubMenu(optionView.cid, optionView.model.get("children"), optionView);
                subView && subView.show();
            }
        },

        _getSubMenu: _.memoize(function(cid, options, parentOption) {
            return new SubMenu(options, parentOption);
        })
    };

    var SubMenu = HoverMenu.extend(_.extend({
        constructor: function(options, parentOption) {
            this.parentOption = parentOption;

            HoverMenu.call(this, options, parentOption.$el);
        },

        show: function() {
            var offset = this.$attachTo.offset(),
                width = this.$attachTo.width();

            this.$el.css({
                top: offset.top,
                left: offset.left + width
            });

            return Menu.prototype.show.apply(this, arguments);
        },

        _onMenuMouseOut: function(optionView, menu, ev) {
            var children = optionView.model.get("children");

            if (children) {
                var subView = this._getSubMenu(optionView.cid),
                    subViewOffset = subView.$el.offset(),
                    posX = ev.pageX - subViewOffset.left,
                    posY = ev.pageY - subViewOffset.top;

                this._menuHovered = posX >= 0 && posX <= subView.$el.width() + 3 &&
                     posY >= 0 && posY <= subView.$el.height() + 3;

            } else {
                this._menuHovered = false;
            }

            this._tryHide();
        }

    }, cascadingMenuTrait));

    return cascadingMenuTrait;
});