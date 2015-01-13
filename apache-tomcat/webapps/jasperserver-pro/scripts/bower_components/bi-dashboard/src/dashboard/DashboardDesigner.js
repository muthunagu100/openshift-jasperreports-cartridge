/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi, Sergii Kylypko
 * @version: $Id: DashboardDesigner.js 125 2014-09-16 15:25:38Z sergey.prilukin $
 */

define(function(require, exports, module){
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        SidebarView = require('./view/designer/SidebarView'),
        DashboardViewer = require('./DashboardViewer'),
        DesignerCanvasView = require('./view/designer/DesignerCanvasView'),
        httpStatusCodes = require("common/enum/httpStatusCodes"),
        DesignerToolbarView = require('./view/designer/DesignerToolbarView'),
        ViewerCanvasView = require('./view/viewer/ViewerCanvasView'),
        DashboardModel = require('./model/DashboardModel'),
        RepositoryResourceModel = require('common/model/RepositoryResourceModel'),
        PropertiesDashboardComponentModel = require('./model/component/PropertiesDashboardComponentModel'),
        DashboardStateCollection = require('./collection/DashboardStateCollection'),
        GridLayoutStrategy = require("./layout/GridLayoutStrategy"),
        dashboardMessageBus = require("./dashboardMessageBus"),
        dashboardMessageBusEvents = require("./enum/dashboardMessageBusEvents"),
        dashboardWiringStandardIds = require("./enum/dashboardWiringStandardIds"),
        welcomeTextTemplate = require('text!dashboard/template/welcomeTextTemplate.htm'),
        i18n = require('bundle!DashboardBundle');

    require("css!dashboard/designer.css");

    return DashboardViewer.extend({
        initialize: function(){
            _.bindAll(this, "_onPageLeave", "_onSessionExpired", "_onUnload");

            this.state = new DashboardStateCollection([], { model: this.model });
            this.strategy = new GridLayoutStrategy(this.model);
            this.sidebar = new SidebarView({ model: this.model, strategy: this.strategy });

            this.designerCanvas = new DesignerCanvasView({
                model: this.model,
                strategy: this.strategy,
                state: this.state
            });

            this.toolbar = new DesignerToolbarView({ model: this.model, state: this.state });
            this.canvas = new ViewerCanvasView({
                model: this.model,
                dashboardId: this.dashboardId
            });

            // canvas will work as preview, we need only render functionality from it, that is why we
            // unsubscribe from from other events to improve performance and hide it
            this.canvas.stopListening();
            this.canvas.$el.hide();
            this.canvas.model = undefined;

            this.listenTo(this.toolbar, "preview:on", _.bind(function() { this.enterPreviewMode(); }, this));
            this.listenTo(this.toolbar, "preview:off", _.bind(function() { this.exitPreviewMode(); }, this));
            this.listenTo(this.toolbar, "grid:on", _.bind(function() { this.showLayoutGrid(); }, this));
            this.listenTo(this.toolbar, "grid:off", _.bind(function() { this.hideLayoutGrid(); }, this));
            this.listenTo(this.toolbar, "dashboard:save", this._onDashboardSave);

            this.listenTo(this.model, "error:all", this._onAllModelErrors);

            this.listenTo(this.sidebar, "open", _.bind(this._onSidebarToggle, this, false));
            this.listenTo(this.sidebar, "close", _.bind(this._onSidebarToggle, this, true));
            this.listenTo(this.sidebar, "resize", _.bind(this._onSidebarResize, this));
            this.listenTo(this.sidebar, "resizeStop", _.bind(this._resizeComponents, this));

            this.listenTo(dashboardMessageBus, dashboardMessageBusEvents.SAVE_DASHBOARD_STATE, _.bind(this.state.saveState, this.state));
            this.listenTo(dashboardMessageBus, dashboardMessageBusEvents.SESSION_EXPIRED, this._onSessionExpired);

            this.render();

            this._startHistory();
            this._initPreventTextSelection('#banner', '#frame');

            if (window.onpagehide || window.onpagehide === null) {
                $(window).on('pagehide', this._onUnload);
            } else {
                $(window).on('unload', this._onUnload);
            }

            $(window).on("beforeunload", this._onPageLeave);
            $(window).on(dashboardMessageBusEvents.SESSION_EXPIRED, this._onSessionExpired);
        },

        showInitialMessage: function() {
            this.designerCanvas.showMessage(_.template(welcomeTextTemplate, { i18n: i18n }));
        },

        hideMessageBox: function() {
            this.designerCanvas.hideMessage();
        },

        enterPreviewMode: function() {
            this.$el.removeClass("twoColumn").addClass("oneColumn");

            this.sidebar.$el.hide();
            this.designerCanvas.$el.hide();
            this.canvas.$el.show();

            this.canvas.model = this.model.clone();

            this.canvas.render();

            this.canvas.$el.addClass("previewMode");

            this.canvas.model.currentFoundation.startLoadingSequence();
        },

        exitPreviewMode: function() {
            this.$el.removeClass("oneColumn").addClass("twoColumn");

            this.canvas.$el.removeClass("previewMode");
            this.canvas.$el.hide();
            this.canvas.disableAutoRefresh();
            this.canvas.removeAllComponentViews();

            this.sidebar.$el.show();
            this.designerCanvas.$el.show();

            delete this.canvas.model;

            this._resizeComponents();
            this.sidebar.accordion.fit();
        },

        showLayoutGrid: function(){
            this.designerCanvas.$el.find('.grid').show();
        },

        hideLayoutGrid: function(){
            this.designerCanvas.$el.find('.grid').hide();
        },

        _onPageLeave: function(e) {
            if (this.sessionExpired) {
                //force reload without any check in case of session expiration
                return undefined;
            }

            if ((!this.model.isNew() && this.state.hasPreviousState()) ||
                (this.model.isNew() && this.model.currentFoundation.hasVisualComponents())) {
                (e || window.event).returnValue = i18n["dashboard.dialog.unsaved.changes"];
                return i18n["dashboard.dialog.unsaved.changes"];
            }
        },

        _onDashboardSave: function() {
            this.state.init();

            this._updateLocationHash();
        },

        _updateLocationHash: function() {
            if (this.model.has('uri')) {
                this.history.navigate(this.model.get('uri'), { trigger: false, replace: false });
            }
        },

        _onLocationHashChange: function(uri){
            if ((!this.model.isNew() && this.state.hasPreviousState()) ||
                (this.model.isNew() && this.model.currentFoundation.hasVisualComponents())) {
                if (window.confirm(i18n["dashboard.dialog.unsaved.changes"])) {
                    this._loadModelByUri(uri);
                } else {
                    this.history.navigate(this.model.get('uri'), { trigger: false, replace: true });
                }
            } else {
                this._loadModelByUri(uri);
            }
        },

        _onAllModelErrors: function(model, errorObj, xhr) {
            this.model.unset("uri");

            var errorMsg = i18n["dashboard.canvas.error." + errorObj.errorCode]
                || i18n[xhr.status === 404 ? "dashboard.canvas.error.not.found" : "dashboard.canvas.error.unexpected.error"];

            this.designerCanvas.showMessage(errorMsg);
        },

        _onSidebarToggle: function(sidebarIsHided) {
            var $designerCanvasEl = this.designerCanvas.$el,
                left = this.sidebar.$contentContainer[sidebarIsHided ? "outerWidth" : "width"]() -
                    (sidebarIsHided ? parseInt($designerCanvasEl.css("marginLeft")) / 2 : 0);

            $designerCanvasEl.css({left: left});
            this.toolbar.$el.css({left: left});

            this._resizeComponents();
        },

        _onSidebarResize: function(e, ui) {
            var left = ui.size.width;

            this.designerCanvas.$el.css({left: left});
            this.toolbar.$el.css({left: left});
        },

        _onSessionExpired: function() {
            this.sessionExpired = true;
            window.location.reload();
        },

        _onUnload: function() {
            var options = _.pick(this, "sessionExpired");
            this.designerCanvas.remove(options);
            this.canvas.remove(options);
        },

        _resizeComponents: function() {
            _.invoke(this.designerCanvas.componentViews, "resize");
        },

        render: function(){
            this.$el.empty();

            // do not render viewer canvas, because it's hidden by default. it will be rendered only when preview mode
            // will be enabled
            this.$el.append(this.toolbar.render().$el);
            this.$el.append(this.canvas.$el);
            this.$el.append(this.designerCanvas.render().$el);
            this.$el.append(this.sidebar.render().$el);

            return this;
        },

        remove: function(){
            this.sidebar.remove();
            this.strategy.remove();
            this.designerCanvas.remove();

            $(window).off(dashboardMessageBusEvents.SESSION_EXPIRED, this._onSessionExpired);
            $(window).off("beforeunload", this._onPageLeave);
            $(window).off('pagehide unload');

            DashboardViewer.prototype.remove.apply(this, arguments);
        }
    });
});