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
 * Basic Menu component.
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: Menu.js 270 2014-10-13 19:58:03Z agodovanets $
 */

define(function (require) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        OptionContainer = require("../option/OptionContainer"),
        menuOptionTemplate = require("text!./template/menuOptionTemplate.htm"),
        menuContainerTemplate = require("text!./template/menuContainerTemplate.htm");

    require("css!menu.css");

    /**
     * @constructor Menu
     * @classdesc Basic Menu component. Works as a base for all other menu types.
     * @extends OptionContainer
     * @param {array} options - Array containing objects with "label" and "action" properties, e.g. [ { label: "Save Dashboard", action: "save" } ].
     * @param {object} [additionalSettings] - Additional settings object.
     * @param {string} [additionalSettings.menuContainerTemplate=common/component/menu/template/menuContainerTemplate.htm] - HTML template for a menu container.
     * @param {string} [additionalSettings.menuOptionTemplate=common/component/menu/template/menuOptionTemplate.htm] - HTML template for a single menu option.
     * @param {boolean} [additionalSettings.toggle] - Flag indicates that menu options can be in active/inactive states.
     * @param {string} [additionalSettings.toggleClass] - CSS class that is added to menu option when option is active.
     * @throws "Menu should have options" error if no menu options were passed to constructor.
     * @fires option:<action> events when menu option is clicked.
     * @example
     *  var menu = new Menu([ { label: "Save Dashboard", action: "save" } ], { toggle: true });
     */
    return OptionContainer.extend({
        constructor: function(options, additionalSettings) {
            if (!options || !_.isArray(options) || options.length === 0) {
                throw new Error("Menu should have options");
            }

            additionalSettings || (additionalSettings = {});

            OptionContainer.call(this, {
                options: options,
                mainTemplate: additionalSettings.menuContainerTemplate || menuContainerTemplate,
                optionTemplate: additionalSettings.menuOptionTemplate || menuOptionTemplate,
                toggle: additionalSettings.toggle,
                toggleClass: additionalSettings.toggleClass
            });
        },

        initialize: function() {
            OptionContainer.prototype.initialize.apply(this, arguments);

            $("body").append(this.$el);

            // extension point for traits
            this._onInitialize && this._onInitialize();
        }
    });
});