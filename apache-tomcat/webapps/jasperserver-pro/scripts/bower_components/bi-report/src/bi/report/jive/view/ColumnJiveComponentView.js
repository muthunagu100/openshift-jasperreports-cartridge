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
 * @author: Igor Nesterenko
 * @version: $Id: ColumnJiveComponentView.js 2833 2014-11-09 15:19:31Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var BaseJiveComponentView =  require("./BaseJiveComponentView"),
        $ = require("jquery"),
        log =  require("logger").register("Report");

    return BaseJiveComponentView.extend({
        _renderComponent: function(){
            this.jiveColumn = this.model.get("moduleType");
            var dfd = new $.Deferred();

            this.jiveColumn.init(this.report);
            var scaleFactor = this.model.get("scaleFactor");
            if(scaleFactor){
                this.jiveColumn.scale(scaleFactor);
            }

            log.debug("Apply column jive component: ", this.jiveColumn);

            dfd.resolve();

            return dfd;
        },

        scale: function(scaleFactor){
            this.model.set("scaleFactor", scaleFactor);
            this.jiveColumn && this.jiveColumn.scale(scaleFactor);
        },

        _getModulesToLoad: function() {
            var modules = BaseJiveComponentView.prototype._getModulesToLoad.call(this);

            //needed for proper rendering of calendar in JIVE
            modules.push("csslink!jasperreports-global-css");
            modules.push("csslink!jquery-ui-custom-css-visualizejs");

            return modules;
        },

        remove: function() {
            this.jiveColumn && this.jiveColumn.remove(this.report);

            BaseJiveComponentView.prototype.remove.call(this, arguments);
        }
    });
});

