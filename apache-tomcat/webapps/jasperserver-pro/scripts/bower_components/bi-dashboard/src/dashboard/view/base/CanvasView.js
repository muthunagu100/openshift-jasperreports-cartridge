/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi, Zakhar Tomchenko
 * @version: $Id: CanvasView.js 11 2014-08-22 13:49:12Z ktsaregradskyi $
 */

define(function(require, exports, module) {

    var Backbone = require("backbone"),
        $ = require("jquery"),
        _ = require("underscore"),
        dashboardComponentViewFactory = require("../../factory/dashboardComponentViewFactory"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        canvasTemplate = require('text!dashboard/template/canvasTemplate.htm'),
        log = require("logger").register(module),
        i18n = require('bundle!DashboardBundle');

    require("css!dashboard/canvas.css");

    return Backbone.View.extend({
        template: _.template(canvasTemplate),

        el: function() {
            return this.template({ i18n: i18n });
        },

        initialize: function(options) {
            options || (options = {});

            var self = this;

            this.ready = new $.Deferred();

            this.componentViews = [];
            this.dashboardId = options.dashboardId;

            this.$canvasBody = this.$(" > .content > .body");

            this.listenTo(this.model.foundations, "addComponent", function(componentModel, foundationModel) {
                if (foundationModel === self.model.currentFoundation) {
                    self.addComponentView(componentModel);
                }
            });

            this.listenTo(this.model.foundations, "removeComponent", function(componentModel, foundationModel) {
                if (foundationModel === self.model.currentFoundation) {
                    self.removeComponentView(componentModel);
                }
            });
        },

        render: function() {
            if (this.model.currentFoundation) {
                var html = this.model.currentFoundation.components.toHTML(true),
                    self = this;

                this.removeAllComponentViews();
                this.disableAutoRefresh();

                this.$canvasBody.html(html);

                if (html) {
                    this.hideMessage && this.hideMessage();

                    this.model.currentFoundation.components.forEach(_.bind(this.addComponentView, this));

                    this.componentViews.length && $.when.apply($, _.pluck(this.componentViews, "ready")).then(function() { self.ready.resolve(); });

                    this.enableAutoRefresh();
                }
            }

            return this;
        },

        removeComponentView: function(componentModel) {
            var dashletView = this.getComponentViewByComponentId(componentModel.id),
                index = _.indexOf(this.componentViews, dashletView);

            dashletView && dashletView.remove();

            if (index > -1) {
                this.componentViews.splice(index, 1);
            }

            this.$canvasBody.find("[" + dashboardSettings.COMPONENT_ID_ATTRIBUTE + "='" + componentModel.id + "']").remove();

            log.debug("removed dashlet " + componentModel.id);
        },

        addComponentView: function(componentModel) {
            if (componentModel.isVisible() && !this.getComponentViewByComponentId(componentModel.id)) {
                var componentView = dashboardComponentViewFactory({
                    model: componentModel,
                    dashboardProperties: this.model.currentFoundation.components.getDashboardPropertiesComponent(),
                    dashboardId: this.dashboardId
                }, this.isDesigner);

                if (componentModel.get("type") !== dashboardComponentTypes.INPUT_CONTROL) {
                    var $dashlet = this.$canvasBody.find("[" + dashboardSettings.COMPONENT_ID_ATTRIBUTE + "='" + componentModel.id + "']");

                    this.hideMessage && this.hideMessage();

                    if (!$dashlet.length) {
                        $dashlet = $(componentModel.toHTML(true));
                        this.$canvasBody.append($dashlet);
                    }

                    this.componentViews.push(componentView);

                    $dashlet.html(componentView.render().$el);

                    this.listenTo(componentView, "maximize", _.bind(this.maximizeDashlet, this, componentView));

                    log.debug("added dashlet " + componentModel.id);
                } else {
                    var dashletGroupComponentModel = componentModel.getParent(),
                        dashletGroupView = this.getComponentViewByComponentId(dashletGroupComponentModel.id);

                    if (!dashletGroupView) {
                        this.addComponentView(dashletGroupComponentModel);
                        dashletGroupView = this.getComponentViewByComponentId(dashletGroupComponentModel.id);
                    }

                    dashletGroupView.component.componentViews = this.componentViews;

                    this.componentViews.push(componentView);

                    var position = componentModel.get("position"),
                        children = dashletGroupComponentModel.getChildren(),
                        modelToInsertAfter,
                        differenceInPositions = 9999999;

                    _.each(children, function(inputControlComponentModel) {
                        if (position > inputControlComponentModel.get("position") && differenceInPositions > (position-inputControlComponentModel.get("position"))) {
                            differenceInPositions = position - inputControlComponentModel.get("position");
                            modelToInsertAfter = inputControlComponentModel;
                        }
                    });

                    if(!modelToInsertAfter) {
                        dashletGroupView.$content.prepend(componentView.render().$el);
                    } else {
                        this.getComponentViewByComponentId(modelToInsertAfter.get("id")).$el.after(componentView.render().$el);
                    }

                    dashletGroupView._resizeComponent();
                    dashletGroupView.refreshFilterGroup();

                    log.debug("added input control " + componentModel.id);
                }
            }

            return componentView;
        },

        removeAllComponentViews: function(options) {
            _.invoke(this.componentViews, "remove", options);

            this.componentViews = [];
        },

        refresh: function() {
            var refreshableViews = this.componentViews.filter(function(view) { return _.isFunction(view.refresh); }),
                dfd = new $.Deferred();

            this.ready
                .then(function() {
                    $.when.apply($, _.invoke(refreshableViews || [], "refresh")).then(dfd.resolve, dfd.reject);
                }, dfd.reject);

            return dfd;
        },

        cancel: function() {
            var cancellableViews = this.componentViews.filter(function(view) { return _.isFunction(view.refresh) && _.isFunction(view.cancel); }),
                dfd = new $.Deferred();

            this.ready
                .then(function() {
                    $.when.apply($, _.invoke(cancellableViews || [], "cancel")).then(dfd.resolve, dfd.reject);
                }, dfd.reject);

            return dfd;
        },

        remove: function(options) {
            this.disableAutoRefresh();
            this.removeAllComponentViews(options);

            Backbone.View.prototype.remove.apply(this, arguments);
        },

        getComponentViewByComponentId: function(id) {
            return _.find(this.componentViews, function(dashlet) { return dashlet.model.id === id; });
        },

        maximizeDashlet: function(dashlet) {
            var maximizedClassName = "maximized",
                $el = dashlet.render().$el,
                $overlay;

            if (!this.isDashletMaximized) {
                dashlet.$el.parent().addClass(maximizedClassName);
                $overlay = $("<div/>", {
                    "class": "canvasOverlay"
                });

                dashlet.toolbar.getOptionView("maximize").$el.addClass(dashboardSettings.DASHLET_TOOLBAR_MINIMIZE_BUTTON_CLASS)
                    .prop('title', i18n["dashboard.canvas.dashlet.minimize"]);

                $overlay.html($el);
                this.$canvasBody.append($overlay);
                this.isDashletMaximized = true;
            } else {
                var $container = this.$canvasBody.find('.' + maximizedClassName);
                $container.html($el).removeClass(maximizedClassName);
                this.$canvasBody.find(".canvasOverlay").remove();
                this.isDashletMaximized = false;
            }

            _.delay(_.bind(dashlet.resize, dashlet), 3);
        },

        enableAutoRefresh: function() {
            var self = this;

            function calculateRefreshTimeout(interval, unit) {
                var ratio = 1000;

                if (unit === "minute") {
                    ratio *= 60;
                }

                return interval * ratio;
            }

            function recursiveRefresh(view, model) {
                view.ready.done(function() {
                    if (self._autoRefreshEnabled && _.isFunction(view.refresh) && model.get("autoRefresh")) {
                        setTimeout(function () {
                            if (self._autoRefreshEnabled && _.isFunction(view.refresh) && model.get("autoRefresh")) {
                                view.refresh().always(function () {
                                    recursiveRefresh.call(self, view, model)
                                });
                            }
                        }, calculateRefreshTimeout(model.get("refreshInterval"), model.get("refreshIntervalUnit")));
                    }
                });
            }

            this.model.currentFoundation.components.forEach(function(componentModel) {
                if (componentModel.isAutoRefreshable() && componentModel.get("autoRefresh")) {
                    self._autoRefreshEnabled = true;

                    var view = componentModel.get("type") === dashboardComponentTypes.DASHBOARD_PROPERTIES
                        ? self
                        : self.getComponentViewByComponentId(componentModel.id);

                    _.isFunction(view.refresh) && recursiveRefresh.call(self, view, componentModel);
                }
            });
        },

        disableAutoRefresh: function() {
            this._autoRefreshEnabled = false;
        }
    });
});
