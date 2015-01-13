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
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: WebPageView.js 380 2014-11-09 15:04:25Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        browserDetection = require("common/util/browserDetection"),
        i18n = require("bundle!CommonBundle");

    require("css!webPageView.css");

    /*
     * Set "src" attribute for <iframe> and start timeout to show error message.
     */
    function setIframeSrc() {
        this.$iframe.attr("src", this.url);

        this._iframeSrcSet = true;

        //this.$el.removeClass("hideLoadingAnimation").find(".externalUrlLoadError").remove();

        this.$iframe.css({
            //"top": 0,
            "background-color": "transparent"
        });

        this._loadingTimeoutId && clearTimeout(this._loadingTimeoutId);

        //this._loadingTimeoutId = setTimeout(_.bind(showError, this), this.timeout);
        this._loadingTimeoutId = setTimeout(_.bind(function() {
            this.$iframe.css("background-color", "#FFFFFF");
        }, this), this.timeout);
    }

    /*
     * Show error message after timeout.
     * This is done because we cannot determine if site was loaded in iframe or not.
     * If site was successfully loaded, then this error message will not be visible (it will covered with actual iframe
     * content).
     */
    function showError() {
        var $div = $("<div></div>"),
            errorMessage = i18n["external.url.load.error"] || "Failed to load external URL '{0}'";

        $div
            .html(errorMessage.replace("{0}", this.url).replace("\n", "<br/>"))
            .addClass("externalUrlLoadError");

        this.$el.addClass("hideLoadingAnimation").prepend($div);

        this.$iframe.css({
            "top": (-$div.outerHeight()) + "px",
            "background-color": "#FFFFFF"
        });
    }

    /*
     * Embeddable WebPageView component.
     */
    var WebPageView = Backbone.View.extend({
        /*
         * Backbone will automatically create element for view with specified tagName and className.
         */
        tagName: "div",
        className: "webPageView",

        /*
         * Constructor.
         *
         * @param options Object that holds various options for component:
         *      url - String - url of web-site to open
         *      scrolling - Boolean - should iframe element have scroll-bars
         *      timeout - Number - timeout in milliseconds after which error message will be shown
         *      renderTo - Sizzle-style selector, DOM element or jQuery element - if specified, component will be
         *              rendered to this container automatically
         *
         * @throws Error Error is thrown if renderTo option is specified but such element doesn't exist in DOM.
         */
        constructor: function(options) {
            options || (options = {});

            if (options.renderTo && (!$(options.renderTo)[0] || !$(options.renderTo)[0].tagName)) {
                throw new Error("WebPageView cannot be rendered to specified container");
            }

            this.renderTo = options.renderTo;
            this.url = options.url;
            this.scrolling = _.isUndefined(options.scrolling) ? WebPageView.SCROLLING : options.scrolling;
            this.timeout = _.isUndefined(options.timeout) ? WebPageView.TIMEOUT : options.timeout;

            Backbone.View.prototype.constructor.apply(this, arguments);
        },

        /*
         * Create an <iframe> element, make it invisible and attach it to <body>.
         */
        initialize: function() {
            this.$iframe = $("<iframe></iframe>")
                .addClass("externalUrlIframe");

            this.$iframe.on("load", function(){
                $(this).blur();
                $(this).parent().focus();
            });

            this.$el.html(this.$iframe);

            this.$el.addClass("invisible");

            $("body").append(this.$el);

            this.setScrolling(this.scrolling, {silent: true});

            if (this.url && _.isString(this.url)) {
                setIframeSrc.call(this);

                if (this.renderTo) {
                    this.render(this.renderTo);
                }
            }
        },

        /*
         * Render component to specified container. Triggers "render" event.
         *
         * @param container Sizzle-style selector, DOM element or jQuery element to render component to.
         *
         * @throws Error If url for component is not specified.
         * @throws Error If container cannot be found in DOM.
         *
         * @return Component instance.
         */
        render: function(container) {
            if (!this.url || !_.isString(this.url)) {
                throw new Error("WebPageView URL is not specified");
            }

            if (!container || !$(container)[0] || !$(container)[0].tagName) {
                throw new Error("WebPageView cannot be rendered to specified container");
            }

            if (!this._iframeSrcSet) {
                setIframeSrc.call(this);
            }

            var $el = this.$el.detach();

            $el.removeClass("invisible");

            $(container).html($el);

            this._rendered = true;

            this.trigger("render", this, $(container));

            return this;
        },

        /*
         * Set URL property. Triggers "change:url" event.
         *
         * @param url String representing URL of web page.
         * @param noRefresh Optional parameter. If equals to true, component will not be automatically refreshed.
         */
        setUrl: function(url, noRefresh) {
            this.url = url;

            this.trigger("change:url", this, this.url);

            if (!noRefresh) {
                this.refresh();
            }
        },

        /*
         * Set timeout property. Triggers "change:timeout" event.
         *
         * @param timeout Number in milliseconds for load timeout.
         */
        setTimeout: function(timeout) {
            this.timeout = timeout;

            this.trigger("change:timeout", this, this.timeout);
        },

        /*
         * Set scrolling property. Will automatically update scroll-bars of the <iframe> element. Triggers "change:scrolling" event.
         *
         * @param {boolean} scrolling value meaning if scroll-bars should be shown or not.
         * @param {object} options
         * @param {boolean} options.silent if set to 'true' then no event will be triggered
         */
        setScrolling: function(scrolling, options) {
            this.scrolling = scrolling;

            this.$iframe
                .attr("scrolling", this.scrolling ? "yes" : "no");

            //if this code will be executed on desktop browser
            //additional unnecessary scroll will be shown.
            //TODO: Need to think how to replace with feature detection.
            if (browserDetection.isIPad()) {
                this.scrolling
                    ? this.$el.addClass("touchScroll")
                    : this.$el.removeClass("touchScroll");
            }

            if (!options || !options.silent) {
                this.trigger("change:scrolling", this, this.scrolling);
            }
        },

        /*
         * Refresh <iframe> content. Triggers "refresh" event.
         *
         * @throws Error If component was not yet rendered to container.
         * @throws Error If URL is not specified.
         */
        refresh: function() {
            if (!this._rendered) {
                throw new Error("WebPageView must be rendered to a specific container first");
            }

            if (!this.url || !_.isString(this.url)) {
                throw new Error("WebPageView URL is not specified");
            }

            setIframeSrc.call(this);

            this.trigger("refresh", this, this.url);
        },

        /*
         * Remove component from DOM. Triggers "remove" event.
         */
        remove: function() {
            this._loadingTimeoutId && clearTimeout(this._loadingTimeoutId);

            this.$iframe.off("load");

            this.trigger("remove", this);

            Backbone.View.prototype.remove.apply(this, arguments);
        }
    }, {
        /*
         * Static Number property representing default timeout in milliseconds after which error message will
         * be shown while loading web page in <iframe>.
         */
        TIMEOUT: 20000,

        /*
         * Static Boolean property representing default state of scroll-bars of <iframe> element.
         */
        SCROLLING: true,

        /*
         * Static method to create new WebPageView component instance.
         *
         * @param settings String or Object If String, then it's treated as url parameter.
         *                                  For object case see parameters of constructor.
         * @param callback Function Optional function to call after component initialization. If error occurred, callback
         *      will be called with Error as first argument. If component instance was successfully created, then
         *      callback is called with undefined as first argument and component instance as second.
         *
         * @return New WebPageView component instance.
         *
         * @throws Error If callback was not specified and error occurred while initializing new instance of component.
         */
        open: function(settings, callback) {
            var err;

            try {
                var view = new WebPageView(_.isObject(settings) ? settings : { url: settings });
            } catch(ex) {
                err = ex;

                if (!callback || !_.isFunction(callback)) {
                    throw ex;
                }
            }

            callback && _.isFunction(callback) && callback(err, view);

            return view;
        }
    });

    return WebPageView;
});