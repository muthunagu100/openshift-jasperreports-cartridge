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
 * @author: Zakhar Tomchenko, Kostiantyn Tsaregradskyi
 * @version: $Id: Panel.js 307 2014-10-22 13:15:28Z psavushchik $
 */

define(function(require){
    "use strict";

    var _ = require('underscore'),
        Backbone = require('backbone'),
        panelTemplate = require('text!./template/panelTemplate.htm');

    require("css!panel.css");

    return Backbone.View.extend({
        defaultTemplate: panelTemplate,

        el: function() {
            return this.template({
                title: this.title,
                additionalCssClasses: this.additionalCssClasses
            });
        },

        constructor: function(options) {
            if (_.isUndefined(options) || !_.isObject(options)) {
                throw new Error("No init options were specified");
            }

            this.template = _.template(options.template || this.defaultTemplate);
            this.title = options.title || "";
            this.additionalCssClasses = options.additionalCssClasses || "";
            this.content = options.content || "";
            this.collapsed = !options.collapsed;
            this.openClass = options.openClass || "open";
            this.closedClass = options.closedClass || "closed";
            this.loadingClass = options.loadingClass || "loading";
            this.fixedHeight = options.fixedHeight || false;
            this.contentContainer = options.contentContainer || ".subcontainer";
            this.overflow = options.overflow || "auto";

            this.traits = options.traits || [];

            // extend panel with additional stuff from traits
            _.each(this.traits, _.bind(function(trait) {
                trait.extension && _.extend(this, trait.extension);
            }, this));

            this.invokeTraits("onConstructor", options);

            Backbone.View.apply(this, arguments);
        },

        invokeTraits: function(method) {
            var args = Array.prototype.slice.call(arguments, 1),
                self = this;

            _.each(this.traits, function(trait) {
                trait[method] && trait[method].apply(self, args);
            });
        },

        initialize: function(options){
            this.invokeTraits("beforeInitialize", options);

            if (this.content) {
                this.setContent(this.content);
            }

            this.toggleCollapsedState();

            this.invokeTraits("afterInitialize", options);
        },

        setElement: function(el){
            this.invokeTraits("beforeSetElement", el);

            var res = Backbone.View.prototype.setElement.apply(this, arguments);
            this.$contentContainer = this.$(this.contentContainer);

            //update set DOM element content according to required state
            this.$contentContainer[this.collapsed ? "hide" : "show"]();

            this.invokeTraits("afterSetElement", el);

            return res;
        },

        open: function(options){
            this.invokeTraits("beforeOpen", options);

            this.$contentContainer.show();
            this.$el.removeClass(this.closedClass).addClass(this.openClass);
            this.collapsed = false;
            options && options.renderContent && this.renderContent();

            this.invokeTraits("afterOpen", options);

            (options && options.silent) || this.trigger('open', this);

            return this;
        },

        close: function(options){
            this.invokeTraits("beforeClose", options);

            this.$contentContainer.hide();
            this.$el.removeClass(this.openClass).addClass(this.closedClass);
            this.collapsed = true;

            this.invokeTraits("afterClose", options);

            (options && options.silent) || this.trigger('close', this);

            return this;
        },

        setContent: function(content) {
            this.content = content;

            var rendered = this.renderContent();

            this.$contentContainer[typeof content === "string" ? "html" : "append"](rendered);
        },

        renderContent: function() {
            return this.content instanceof Backbone.View
                ? this.content.render().$el
                : this.content;
        },

        setHeight: function(height) {
            var headerHeight = this.$("> .header").outerHeight();

            this.$contentContainer.css({
                "height": _.isNumber(height) ? ((height - headerHeight) + "px") : "auto",
                "overflow": this.overflow
            });
        },

        toggleCollapsedState: function(){
            this.collapsed ? this.open() : this.close();

            return this;
        },

        remove: function(){
            this.invokeTraits("onRemove");

            this.content && this.content.remove && this.content.remove();

            Backbone.View.prototype.remove.call(this);
        }
    });
});
