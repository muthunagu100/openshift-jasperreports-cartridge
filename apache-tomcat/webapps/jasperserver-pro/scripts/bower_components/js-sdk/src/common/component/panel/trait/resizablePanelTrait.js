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
 * @author: Olesya Bobruyko
 * @version: $Id: resizablePanelTrait.js 408 2014-11-13 20:12:29Z obobruyko $
 */

define(function(require){
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        abstractPanelTrait = require("./abstractPanelTrait");

    return _.extend({}, abstractPanelTrait, {
        onConstructor: function(options) {
            this.handles = options.handles || "e, s, se";
            this.minWidth = options.minWidth || 10;
            this.minHeight = options.minHeight || 10;
            this.maxWidth = options.maxWidth || null;
            this.alsoResize = options.alsoResize || false;
            this.resizableEl = options.resizableEl;
        },

        afterSetElement: function(el){
            this.$resizableEl = this.$el.find(this.resizableEl).length ? this.$el.find(this.resizableEl) : this.$el;

            this.$resizableEl.resizable({
                handles: this.handles,
                minHeight: this.minHeight,
                minWidth: this.minWidth,
                maxWidth: this.maxWidth,
                alsoResize: this.alsoResize,
                resize: _.bind(this._onResize, this),
                start: _.bind(this._onStart, this),
                stop: _.bind(this._onStop, this)
            });
        },

        onRemove: function() {
            try {
                this.$el.resizable("destroy");
            } catch (e) {
                // destroyed already, skip
            }
        },

        extension: {
            _onResize: function(e, ui) {
                this.trigger("resize", e, ui);
            },

            _onStart: function(e, ui){
                this.trigger("resizeStart", e, ui);
            },

            _onStop: function(e, ui){
                this.trigger("resizeStop", e, ui);
            }
        }
    });
});