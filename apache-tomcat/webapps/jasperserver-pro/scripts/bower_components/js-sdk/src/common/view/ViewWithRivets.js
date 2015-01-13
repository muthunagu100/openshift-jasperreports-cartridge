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
 * Basic Backbone.View with RivetsJS support.
 *
 * @author: Taras Bidyuk, Kostiantyn Tsaregradskyi
 * @version: $Id: ViewWithRivets.js 270 2014-10-13 19:58:03Z agodovanets $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        viewRivetsTrait = require("./trait/viewRivetsTrait"),
        _ = require("underscore");

    var ViewWithRivets = Backbone.View.extend({
        /**
         * @method el
         * @description Generates HTML for view's root element from template.
         * @returns {string}
         */
        el: function() {
            return this.template({ i18n: this.i18n, model: this.model.toJSON(), options: this.options });
        },

        /**
         * @constructor ViewWithRivets
         * @classdesc Basic Backbone.View with RivetsJS support.
         * @param options
         * @param {string} options.template - template for your view.
         * @param {Backbone.Model} options.model - Backbone.Model instance.
         * @param {object} [options.i18n={}] - i18n object.
         */
        constructor: function(options) {
            options || (options = {});

            if (!options.template) {
                throw new Error("Template must be defined");
            }

            if (!options.model) {
                throw new Error("Model must be defined");
            }

            this.template = _.template(options.template);
            this.model = options.model;
            this.i18n = options.i18n || {};
            this.options = _.omit(options, "model", "template", "i18n");

            Backbone.View.apply(this, arguments);
        },

        /**
         * @method render
         * @description Binds RivetsJS to view. In most cases should be extended in child classes.
         * @returns {ViewWithRivets}
         */
        render: function(){
            this.bindRivets();

            return this;
        },

        /**
         * @method remove
         * @description Unbinds RivetsJS from view and calls Backbone.View remove method.
         */
        remove: function() {
            this.unbindRivets();

            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    /** extend with @link viewWithRivets */
    _.extend(ViewWithRivets.prototype, viewRivetsTrait);

    return ViewWithRivets;
});
