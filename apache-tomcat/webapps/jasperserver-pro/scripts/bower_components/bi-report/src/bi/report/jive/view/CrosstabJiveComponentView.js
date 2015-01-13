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
 * @version: $Id: CrosstabJiveComponentView.js 2803 2014-10-28 20:05:30Z inesterenko $
 */

define(function (require) {
    "use strict";

    var BaseJiveComponentView =  require("./BaseJiveComponentView"),
        $ = require("jquery");

    return BaseJiveComponentView.extend({
        _renderComponent: function($el){
            this.jiveCrosstab = this.model.get("uiModuleType");
            var dfd = new $.Deferred();

            $el.attr('data-reportId', this.report.id);
            // override to return correct element
            this.jiveCrosstab.getReportContainer = function(id) {
                return $("[data-reportId = '"+ id +"']");
            };

            this.jiveCrosstab.init(this.report);
            var scaleFactor = this.model.get("scaleFactor");
            if(scaleFactor){
                this.jiveCrosstab.scale(scaleFactor);
            }

            dfd.resolve();

            return dfd;
        },

        scale: function(scaleFactor){
            this.model.set("scaleFactor", scaleFactor);
            this.jiveCrosstab && this.jiveCrosstab.scale(scaleFactor);
        },

        _getModulesToLoad: function() {
            var modules = BaseJiveComponentView.prototype._getModulesToLoad.call(this);

            modules.push("csslink!jr.jive.crosstab.templates.styles.css");

            return modules;
        },

        remove: function() {
            this.jiveCrosstab && this.jiveCrosstab.remove(this.report);

            BaseJiveComponentView.prototype.remove.call(this, arguments);
        }
    });
});

