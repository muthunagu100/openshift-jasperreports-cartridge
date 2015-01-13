/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi, Zakhar Tomchenko, Sergii Kylypko
 * @version: $Id$
 */

define(function(require, exports, module){
    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require("backbone"),
        browserDetection = require("common/util/browserDetection"),
        ViewerToolbarView = require('./view/viewer/ViewerToolbarView'),
        ViewerCanvasView = require('./view/viewer/ViewerCanvasView'),
        DashboardModel = require('./model/DashboardModel'),
        i18n = require('bundle!DashboardBundle'),
        log = require("logger").register(module);

    require("css!dashboard/viewer.css");

    return Backbone.View.extend({
        constructor: function(options) {
            options || (options = {});

            if (!options.el || !$(options.el)[0] || !$(options.el)[0].tagName) {
                throw new Error("Container for Dashboard is not specified");
            }

            this.model = new DashboardModel({}, { contextPath: options.contextPath });
            this.dashboardId = this._generateDashboardId();

            Backbone.View.apply(this, arguments);
        },

        initialize: function(options) {
            this.toolbar = new ViewerToolbarView({ model: this.model });
            this.canvas = new ViewerCanvasView({
                model: this.model ,
                dashboardId: this.dashboardId
            });

            this.listenTo(this.model, "error:all", this._onAllModelErrors);

            this.render();

            _.bindAll(this, "_onUnload");

            if (window.onpagehide || window.onpagehide === null) {
                $(window).on('pagehide', this._onUnload);
            } else {
                $(window).on('unload', this._onUnload);
            }

            this._startHistory();
            this._initPreventTextSelection('#banner', '#frame');
        },

        render: function(){
            this.$el.empty();

            this.$el.append(this.toolbar.render().el);
            this.$el.append(this.canvas.render().el);

            return this;
        },

        _onAllModelErrors: function(model, errorObj, xhr) {
            var errorMsg = i18n["dashboard.canvas.error." + errorObj.errorCode]
                || i18n[xhr.status === 404 ? "dashboard.canvas.error.not.found" : "dashboard.canvas.error.unexpected.error"];

            this.canvas.showMessage(errorMsg);
        },

        _startHistory: function() {
            this.history = new Backbone.History();
            this.history.route(/.*/, _.bind(this._onLocationHashChange, this));
            this.history.start();
        },

        _loadModelByUri: function(uri) {
            var self = this;

            try {
                uri = decodeURIComponent(uri);
            } catch(ex) {
                log.error(ex);
                uri = undefined;
            }

            if (uri && uri.indexOf("/") !== 0) {
                uri = "/" + uri;
            }

            if (uri == this.model.get("uri")) {
                return;
            }

            this.model.resetToInitialCondition();

            if (!uri) {
                this.showInitialMessage();

                this.model.currentFoundation.startLoadingSequence();

                this.state && this.state.init();
            } else {
                this.hideMessageBox();

                this.model.set({ uri: uri });

                this.model
                    .fetch()
                    .done(function() {
                        self.canvas.componentViews.length
                            && $.when.apply($, _.pluck(self.canvas.componentViews, "ready"))
                                .then(function() { self.canvas.ready.resolve(); });
                        self.canvas.model && self.canvas.enableAutoRefresh();
                    })
                    .fail(function() { self.model.currentFoundation.startLoadingSequence(); })
                    .always(function () { self.state && self.state.init(); });
            }
        },

        _onUnload: function() {
            this.canvas.remove()
        },

        _initPreventTextSelection: function(){
            var selector = Array.prototype.slice.call(arguments, 0).join(",");

            if(browserDetection.isIE8() || browserDetection.isIE9()){
                $(selector).on("selectstart", function(e){
                    var tagName = e.target.tagName;
                    if (tagName != "INPUT" && tagName != "TEXTAREA") {
                        return false;
                    }
                });
            }
        },

        _generateDashboardId: function() {
            return this.model.cid;
        },

        getDashboardId: function() {
            return this.dashboardId;
        },

        showInitialMessage: function() {
            this.canvas.showMessage(i18n["dashboard.canvas.error.not.found"]);
        },

        hideMessageBox: function() {
            this.canvas.hideMessage();
        },

        _onLocationHashChange: function(uri) {
            this._loadModelByUri(uri);
        },

        remove: function(){
            this.history.stop();

            $(window).off('pagehide unload');

            this.canvas.remove();
            this.toolbar.remove();

            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});