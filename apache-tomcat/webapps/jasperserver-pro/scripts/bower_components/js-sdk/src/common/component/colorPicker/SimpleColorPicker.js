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


define(function(require){
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        i18n = require("bundle!CommonBundle"),
        colors = require("./enum/colors"),
        template = require("text!common/component/colorPicker/template/simpleColorPickerTemplate.htm");

    require("css!simpleColorPicker.css");

    return Backbone.View.extend({

        events: {
            "click .color": "_selectColor"
        },

        constructor: function(options){
            this.label = options && options.label;
            this.showTransparentInput = options && options.showTransparentInput;

            Backbone.View.apply(this, arguments);
        },

        el: function() {
            return _.template(template)({
                colors: colors, i18n: i18n,
                label: this.label,
                showTransparentInput: this.showTransparentInput
            });
        },

        highlightColor: function(color){
            var index = _.indexOf(colors, color);
            var colorBox = index >= 0 ? this.$el.find("div[data-index='" + index + "']") : this.$el.find(".color.transparent");
            this.$el.find(".color.transparent.selected, .colorWrapper.selected").removeClass("selected");
            colorBox.addClass("selected");
        },

        _selectColor: function(event){
            var colorEl = $(event.target);
            var color = colorEl.css("background-color");
            this.highlightColor(color);
            this.trigger("color:selected", colorEl.css("background-color"));
        },

        show: function(){
            this.$el.show();
        },

        hide: function(){
            this.$el.hide();
        }

    });
});
