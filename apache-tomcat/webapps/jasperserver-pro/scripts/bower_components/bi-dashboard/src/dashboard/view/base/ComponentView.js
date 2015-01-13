/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: ComponentView.js 945 2014-10-31 16:10:22Z obobruyko $
 */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        i18n = require("bundle!DashboardBundle");

    return Backbone.View.extend({
        template: _.template(""),

        el: function() {
            return this.template({ i18n: i18n });
        },

        initialize: function(options) {
            this.ready = new $.Deferred();

            this.dashboardProperties = options.dashboardProperties;
            this.dashboardId = options.dashboardId;

            _.bindAll(this, "_onWindowResize");

            $(window).on("resize", this._onWindowResize);

            this._onViewInitialize && this._onViewInitialize();

            this._initComponent && this._initComponent();
        },

        render: function() {
            this._onViewRender && this._onViewRender();

            this._renderComponent && this._renderComponent();

            return this;
        },

        resize: function() {
            this._onViewResize && this._onViewResize();

            this._resizeComponent && this._resizeComponent();
        },

        remove: function(options) {
            $(window).off("resize", this._onWindowResize);

            this._removeComponent && this._removeComponent(options);

            this._onViewRemove && this._onViewRemove();

            Backbone.View.prototype.remove.apply(this, arguments);
        },

        _onWindowResize: function(e) {
            //hack which prevent jquery ui resize event from bubbling to window.
            //See http://bugs.jquery.com/ticket/9841
            if (!e.target.tagName) {
                this.resizeTimer && clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(_.bind(this.resize, this), 300);
            }
        }
    });
});