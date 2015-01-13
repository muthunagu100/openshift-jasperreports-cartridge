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
 * @version: $Id: MultiSelectCheckboxControlView.js 120 2014-11-14 13:59:39Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var BaseInputControlView = require("../BaseInputControlView"),
        resizer = require("../../util/resizer"),
        $ = require("jquery"),
        _ = require("underscore"),
        log = require("logger").register(module),
        Mustache = require("mustache"),
        i18n = require("bundle!all"),
        icHelper = require("../../util/inputControlHelpers"),
        checkboxInputItemTemplate = require("text!../../template/checkboxInputItemTemplate.htm"),
        multiSelectCheckboxTemplate = require("text!../../template/multiSelectCheckboxTemplate.htm");

    return BaseInputControlView.extend({

        template: multiSelectCheckboxTemplate,

        renderStructure: function() {

            this.$el = $(Mustache.to_html((this.template || ""), _.extend({
                selectAllMsg: i18n["button.select.all"],
                selectNoneMsg: i18n["button.select.none"],
                selectInverseMsg: i18n["button.select.inverse"]
            }, this.model.toJSON())));

            this.makeResizable();
            this.updateOptionsSelection();

            return this;
        },

        updateOptionsSelection:function () {

            var data = _.map(this.model.state.options.toJSON(), function (val) {
                var result = _.clone(val);
                result.readOnly = this.model.get("readOnly");
                result.uuid = _.uniqueId(this.model.get("id"));
                return result;
            }, this);

            var list = this.$el.find('ul')[0];

            icHelper.setInnerHtml(list, function(data){
                return Mustache.to_html(checkboxInputItemTemplate, data)
            }, {data:data});

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

        getSelection:function () {
            var boxes = this.$el.find(":checkbox").filter(":checked");

            return _.map(boxes, function (box) {
                return $(box).val();
            });
        },

        bindCustomEventListeners:function () {
            var that = this;
            this.$el.on('change', 'input', _.bind(function (evt) {
                var selection = this.getSelection();
                // for better performance in IE7
                setTimeout(function () {
                    that.model.changeState(selection);
                });
            }, this));

            // TODO fix
            this.$el.on('click','a',_.bind(function(evt) {
                evt.preventDefault();

                var options = this.$el.find('input');

                var name = $(evt.target)[0].name;
                if (name === "multiSelectAll" || name === "multiSelectNone") {
                    _.each(options,  function(opt){
                        opt.checked = name === "multiSelectAll";
                    });
                } else if (name === "multiSelectInverse") {
                    _.each(options,  function(opt){
                        opt.checked = !opt.checked;
                    });
                }

                this.$el.find('input').change(); // trigger the cascading request

            }, this));

            this.model.state.options.on("reset", this.updateOptionsSelection, this);
            this.model.state.options.on("change:selected", this.updateOptionsSelection, this);
        },

        //TODO move to decorator
        makeResizable:function () {
            this.resizable = true;
            var list = this.$el.find('ul');

            var sizer = this.$el
                .find('.sizer');

            resizer.createSizer(list, sizer, {axis: "s"});
        },

        remove: function() {
            this.$el.off('change', 'input');
            this.$el.off('click','a');
            this.multiSelect && this.multiSelect.remove();
            this.model.state.options.off("reset", this.updateOptionsSelection, this);
            this.model.state.options.off("change:selected", this.updateOptionsSelection, this);
            BaseInputControlView.prototype.remove.call(this);
        }

    });
});

