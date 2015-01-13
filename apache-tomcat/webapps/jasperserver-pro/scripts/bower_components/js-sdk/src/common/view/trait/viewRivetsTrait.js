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
 * Trait that adds methods to bind/unbind RivetsJS to your view.
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: viewRivetsTrait.js 270 2014-10-13 19:58:03Z agodovanets $
 */

define(function (require) {
    "use strict";

    // TODO: replace with just 'rivets'
    var rivets = require("common/extension/rivetsExtension");

    /**
     * @description Mixin that adds methods to bind/unbind RivetsJS to your view.
     * @mixin viewRivetsTrait
     */
    return {
        /**
         * @function bindRivets
         * @description Binds RivetsJS to root el of a Backbone.View. Passes controller and model to Rivets View.
         */
        bindRivets: function(){
            this.unbindRivets();
            var rivetsData =  { controller: this, model: this.model };
            this._rivetsBinding = rivets.bind(this.$el, rivetsData);
        },

        /**
         * @function unbindRivets
         * @description Unbinds current RivetsJS binding.
         */
        unbindRivets: function(){
            this._rivetsBinding && this._rivetsBinding.unbind();
        }
    }
});
