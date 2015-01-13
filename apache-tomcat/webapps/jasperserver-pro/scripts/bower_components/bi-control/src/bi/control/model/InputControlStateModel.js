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
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: InputControlStateModel.js 8 2014-08-27 11:08:56Z inesterenko $
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        log = require("logger").register(module),
        BaseModel = require("common/model/BaseModel"),
        InputControlOptionCollection = require("../collection/InputControlOptionCollection");

    return BaseModel.extend({
        defaults: {
            id: undefined,
            value: undefined,
            options: undefined,
            uri: undefined,
            error: undefined
        },

        initialize: function() {
            BaseModel.prototype.initialize.apply(this, arguments);

            this.isValue = _.isUndefined(this.get("options"));

            this.options = new InputControlOptionCollection(this.get("options") || []);

            this.on("change:options", _.bind(function() {
                this.options.reset(this.get("options") || []);
            }, this));
            this.on("all", log.debug, log);

        },

        changeState: function(data) {
            if (this.isValue) {
                this.set("value", data);
            } else {
                data = _.isArray(data) ? data : [data];
                this.options.each(function(option) {
                    option.set("selected", _.contains(data, option.get("value")), {silent: true});
                });
                this.options.trigger("change:selected");
                this.options.trigger("change");
            }
        },

        getData: function() {
            if (this.isValue) {
                return [this.get("value")];
            } else {
                return _.compact(this.options.map(function(option) {
                    return option.get("selected") ? option.get("value") : false;
                }));
            }
        }
    });
});