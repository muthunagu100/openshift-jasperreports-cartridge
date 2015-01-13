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


/*
 * @author inesterenko
 * @version: $Id: SingleSelectRadioControlView.js 115 2014-11-12 12:16:57Z ktsaregradskyi $
 */

define(function (require, exports, module) {

    "use strict";

    var BaseInputControlView = require("../BaseInputControlView"),
        resizer = require("../../util/resizer"),
        $ = require("jquery"),
        _ = require("underscore"),
	    browserDetection = require("common/util/browserDetection"),
        log = require("logger").register(module),
        Mustache = require("mustache"),
        icHelper = require("../../util/inputControlHelpers"),
        singleSelectRadioTemplate = require("text!../../template/singleSelectRadioTemplate.htm"),
        radioInputItem = require("text!../../template/radioInputItem.htm");

    return BaseInputControlView.extend({

        template: singleSelectRadioTemplate,

        renderStructure: function() {
            this.$el = $(Mustache.to_html((this.template || ""), this.model.toJSON()));
            this.makeResizable();
            this.renderOptions();
            return this;
        },

        renderOptions: function () {
            var list = this.$el.find('ul')[0];

            var data = _.map(this.model.state.options.toJSON(), function (val) {
                var result = _.clone(val);
                result.readOnly = this.model.get("readOnly");
                result.name = this.getOptionName();
                result.uuid = _.uniqueId(this.model.get("id"));
                return result;
            }, this);

            icHelper.setInnerHtml(list, function(data){
                return Mustache.to_html(radioInputItem, data);
            }, {data:data});

	        if (browserDetection.isIE()) {
		        list.innerHTML += "&nbsp;"; //workaround for IE scrollbar
	        }

            //TODO move to decorator
            if ($(list).find('li').length < 5 && this.$el[0].clientHeight < 125) {
                this.$el.find('.sizer').addClass('hidden');
                this.$el.find('.inputSet').removeClass('sizable').attr('style', false);
            } else {
                if (this.resizable) {
                    this.$el.find('.sizer').removeClass('hidden');
                    this.$el.find('.inputSet').addClass('sizable');
                }
            }
        },
        updateOptionsSelection: function() {
            var that = this;
            this.model.state.options.each(function(option){
                that.$el.find("input[value='" + option.get("value") + "']").prop('checked', option.get("selected"));
            });
        },

        getOptionName:function () {
            return this.model.get("id") + "_option";
        },

        bindCustomEventListeners:function () {
            var that = this;
            this.$el.on('change', 'input', _.bind(function (evt) {
                var selection = evt.target.value;
                // for better performance in IE7
                setTimeout(function () {
                    that.model.changeState(selection);
                });
            }, this));

            this.model.state.options.on("reset", this.renderOptions, this);
            this.model.state.options.on("change:selected", this.updateOptionsSelection, this);
        },

        //TODO move to decorator
        makeResizable:function () {
            this.resizable = true;
            var list = this.$el.find('ul');
            var sizer = this.$el.find('.sizer');

            resizer.createSizer(list, sizer, {axis: "s"});
        },

        remove: function() {
            this.$el.off('change', 'input');
            this.singleSelect && this.singleSelect.remove();
            this.model.state.options.off("reset", this.renderOptions, this);
            this.model.state.options.off("change:selected", this.updateOptionsSelection, this);
            BaseInputControlView.prototype.remove.call(this);
        }

    });
});

