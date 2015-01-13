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
 * @version: $Id: MultiSelectControlView.js 115 2014-11-12 12:16:57Z ktsaregradskyi $
 */

define(function (require, exports, module) {

    "use strict";

    var BaseInputControlView = require("../BaseInputControlView"),
        resizer = require("../../util/resizer"),
        $ = require("jquery"),
        _ = require("underscore"),
        MultiSelect = require("common/component/multiSelect/view/MultiSelect"),
        CacheableDataProvider = require("common/component/singleSelect/dataprovider/CacheableDataProvider"),
        Mustache = require("mustache"),
        icHelper = require("../../util/inputControlHelpers"),
        multiSelectTemplate = require("text!../../template/multiSelectTemplate.htm"),
        log = require("logger").register(module);

    return BaseInputControlView.extend({

        template: multiSelectTemplate,

        INITIAL_MAX_HEIGHT: "240px",

        renderStructure: function () {
            if (!this.multiSelect) {
                this.dataProvider = new CacheableDataProvider();
                this.multiSelect = new MultiSelect({
                    getData: this.dataProvider.getData,
                    visibleItemsCount: this.getAmountOfLinesToDisplay()
                }).setDisabled(this.model.get("readOnly"));
            }

            if (this.template) {
                this.multiSelect.undelegateEvents();
                this.$el.html($(Mustache.to_html(this.template, this.model.toJSON())));
                this.multiSelect.render().renderData();
                this.$el.find(".msPlaceholder").append(this.multiSelect.el);
                this.multiSelect.delegateEvents();
                this.makeResizable();
                this.updateOptionsSelection();
            }
        },

        updateOptionsSelection:function () {
            var controlData = this.model.state.options.toJSON();
            this.dataProvider.setData(controlData);

            var that = this;
            this.multiSelect.fetch(function() {
                var selection = icHelper.extractSelection(controlData);

                that.multiSelect.setValue(selection, {silent: true});
                that.checkSelectionSize(selection);
            }, {keepPosition: true});
        },

        bindCustomEventListeners:function () {
            this.multiSelect.off("selection:change").on("selection:change", function (selection) {
                this.model.changeState(selection);

                this.checkSelectionSize(selection);
            }, this);

            this.model.state.options.on("reset", this.updateOptionsSelection, this);
            this.model.state.options.on("change:selected", this.updateOptionsSelection, this);
        },

        checkSelectionSize: function(selection) {

            var i = 0;
            for (var index in selection) {
                if (selection.hasOwnProperty(index) && i++ >= 4) {
                    break;
                }
            }

            if (i < 5 && this.$el[0].clientHeight < 125) {
                this.$el.find('.sizer').addClass('hidden');
                this.$el.find('.inputSet').removeClass('sizable').attr('style', false);
            } else {
                if (this.resizable) {
                    this.$el.find('.sizer').removeClass('hidden');
                    this.$el.find('.inputSet').addClass('sizable');
                }
            }
        },

        //TODO move to decorator
        makeResizable:function () {
            this.resizable = true;
            var list = this.$el.find('.sList');
            var sizer = list.parents(".leaf").find('.sizer'); // FF 3.6

            resizer.createSizer(list, sizer, {
                axis: "s",
                "max-height": this.INITIAL_MAX_HEIGHT
            });

        },

        remove: function() {
            this.multiSelect.remove();
            this.model.state.options.off("reset", this.updateOptionsSelection, this);
            this.model.state.options.off("change:selected", this.updateOptionsSelection, this);
            BaseInputControlView.prototype.remove.call(this);
        }
    });
});

