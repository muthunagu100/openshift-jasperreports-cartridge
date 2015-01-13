/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: reportTrait.js 1053 2014-12-01 15:04:44Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        json3 = require("json3"),
        Backbone = require("backbone"),
        i18n = require("bundle!DashboardBundle"),
        log = require("logger").register(module),
        Report =  require("bi/report/Report"),
        PaginationView = require("common/component/pagination/Pagination"),
        dashboardWiringStandardIds = require("dashboard/enum/dashboardWiringStandardIds"),
        dashboardSettings = require("../../../dashboardSettings"),
        dashletTrait = require("./dashletTrait"),
        scaleStrategies = require("bi/report/enum/scaleStrategies"),
        rivets = require("common/extension/rivetsExtension"),
        getLinkOptions = require("dashboard/hyperlink/linkOptions"),
        sandboxFactory = require("dashboard/factory/sandboxFactory");

    rivets.formatters.scaleStrategy = {
        publish: function(rawValue) {
            var val = Number(rawValue);
            // if scale strategy is scaling factor represented by number - convert it to Number
            return isNaN(val) ? rawValue : val;
        }
    };

    function getScaleFactor(scaleStrategy, jrWidth, jrHeight, cWidth, cHeight) {
        var scale;
        if (scaleStrategy === scaleStrategies.WIDTH) {
            scale = cWidth / jrWidth;
        } else if (scaleStrategy === scaleStrategies.HEIGHT) {
            scale = cHeight / jrHeight;
        } else {
            var scaleV = cWidth / jrWidth, scaleH = cHeight / jrHeight;
            scale = (scaleV * jrHeight) < cHeight ? scaleV : scaleH;
        }

        return scale;
    }

    function initPagination(options){
        var self = this;

        // request export of 2 pages to know if pagination is needed. (array like func access due to IE8 issue)
        this.component && this.component["export"]({ outputFormat: "html", pages: 2 })
            .done(function() {
                var totalPages = self.component.data().totalPages;
                // pagination initialization with validation and event firing off. Needed in case of not fully loaded report so we can switch the pages in process of loading.
                if(!self.paginationView && totalPages !== 0 ){
                    self._initPagination({total: totalPages, silent: true, validate: false});
                    // make next buttons available
                    self.paginationView.$el.find(".next, .prev, .first").prop("disabled", false);
                }else{
                    totalPages > 1 && self._refreshPagination(totalPages, options);
                }
            }).fail(function(err){
                log.debug(err);
            });
    }

    function isAdhocChartReport(reportView) {
        return reportView.$("> .dashletContent > .content > ._jr_report_container_ > .highcharts_parent_container").length > 0;
    }

    function signalHandler(payload, sender){
        if (payload.name === dashboardWiringStandardIds.REFRESH_SLOT) {
            if (this.paramsModel.paramsChanged) {
                this.paramsModel.paramsChanged = false;
                this.component.params(_.clone(this.paramsModel.attributes));
            }
            this.refresh();
        } else if (payload.name === dashboardWiringStandardIds.APPLY_SLOT) {
            if (this.paramsModel.paramsChanged) {
                this.paramsModel.paramsChanged = false;
                this.component.params(_.clone(this.paramsModel.attributes));
                this.paginationView && this.paginationView.model.set("current", this.paginationView.model.defaults.current);
                this.refresh();
            }
        } else {
            if (_.isUndefined(payload.value)) {
                this.paramsModel.unset(payload.name);
            } else {
                this.paramsModel.set(payload.name, payload.value);
            }
        }
    }

    function parseXhrForErrorCode(xhr) {
        var error;

        try {
            error = json3.parse(xhr.responseText);
        } catch (e) {
            error = {
                message : "Can't parse server response",
                errorCode: "unexpected.error",
                parameters : []
            };
        }

        return error;
    }

    /**
     * Factory to format error messages depending on error code
     */
    var reportErrorMessageFactory = (function() {
        var errorMessageFormatters = {};

        errorMessageFormatters["input.controls.validation.error"] = function(messageObj) {
            return [i18n["dashboard.dashlet.error." + messageObj.errorCode]].concat(messageObj.parameters).join("<br/>");
        };

        return function(messageObj) {
            var formatter = errorMessageFormatters[messageObj.errorCode];

            return formatter
                ? formatter(messageObj)
                : (i18n["dashboard.dashlet.error." + messageObj.errorCode] || i18n["dashboard.dashlet.error.unexpected.error"]);
        };
    })();

    return {
        _onViewInitialize: function() {
            var self = this;

            this.paramsModel = new Backbone.Model();
            this.paramsModel.on("change", function () {
                this.paramsChanged = true;
            });

            this.listenTo(this.model, "signal", _.bind(signalHandler, this));

            this.model.lastPayload && signalHandler.call(this, this.model.lastPayload, this.model.lastSender);

            // dirty hack to handle case when Input Control request for report fails
            // TODO: instead of listening to paramsDfd, we need to listen to errors from ReportParametersModel
            this.model.paramsDfd.fail(function(xhr) {
                self.showMessage(parseXhrForErrorCode(xhr));
            });
        },

        _onChangeLinkOptions: function() {
            var linkOptions = this.dashboardId
                ? sandboxFactory.get(this.dashboardId).get("linkOptions") : {};

            if (this.component) {
                this.component.linkOptions(getLinkOptions(this.component, linkOptions));
            }
        },

        _initComponent: function () {
            var self = this;
            _.bindAll(this, "_onChangeLinkOptions");
            this.dashboardId && sandboxFactory.get(this.dashboardId)
                .on("linkOptions", this._onChangeLinkOptions);

            this.model.getReportResourceUri().done(function (uri) {
                self.component = new Report({
                    resource: uri,
                    container: self.$content,
                    server: dashboardSettings.CONTEXT_PATH,
                    scale: self.model.get("scaleToFit"),
                    events: {
                        changeTotalPages: function(totalPages) {
                            if(totalPages > 1){
                                !self.paginationView ? self._initPagination({total: totalPages}) : self._refreshPagination(totalPages);
                            }else{
                                self.paginationView && self.paginationView.hide();
                            }
                        }
                    }
                });

                //set linkOptions manually first time
                self._onChangeLinkOptions();
            });
        },

        _removeComponent: function (options) {
            var sessionExpired = options ? options.sessionExpired : false;
            !sessionExpired && this.isReportRan && this.component.destroy();
            this.component = null;
            this.isReportRan = false;
            this.dashboardId && sandboxFactory.get(this.dashboardId)
                .off("linkOptions", this._onChangeLinkOptions);
            this._removePagination();
        },

        _renderComponent: function () {
            // usually initial run triggered after wiring is initialized and initial parameters for reports are set
            if (this.isReportRan) {
                this.component.render(_.bind(this.trigger, this, "componentRendered", this));
                !isAdhocChartReport(this) && this._resetContentOverflow(this._calculateContentOverflow());
            }
        },

        _resizeComponent: function () {
            this.component && this._renderComponent();
        },

        refresh: function () {
            var self = this,
                res = new $.Deferred(),
                dfd = this.cancel();

            dfd.always(function() {
                if (self.isReportRan) {
                    self.ready.done(function() {
                        self.isReportRunning = true;

                        self.component
                            .refresh()
                            .fail(res.reject)
                            .done(function () {
                                initPagination.call(self, {resetCurrent: true});
                                !isAdhocChartReport(self) && self._resetContentOverflow(self._calculateContentOverflow(self));

                                res.resolve();

                                !self.$content.find(".jrPage").length && self.showMessage({errorCode: "report.empty.error"});
                            });
                    });
                } else {
                    self.isReportRunning = true;

                    self.component
                        .run()
                        .fail(res.reject)
                        .done(function () {
                            self.isReportRan = true;
                            self.trigger("componentRendered", self);
                            initPagination.call(self);
                            !isAdhocChartReport(self) && self._resetContentOverflow(self._calculateContentOverflow(self));
                            res.resolve();

                            var $jrPageTable = self.$content.find(".jrPage");

                            !$jrPageTable.length && self.showMessage({errorCode: "report.empty.error"});
                        });
                }
            });

            res
                .done(_.bind(this.hideMessage, this))
                .fail(function(errorObj) {
                    if(errorObj.errorCode !== "report.execution.cancelled"){
                        self.$content.empty();
                        self.showMessage(errorObj);
                    }
                })
                .always(_.bind(this._onReportRunFinished, this));

            return res;
        },

        cancel: function () {
            return this.isReportRunning
                ? this.component.cancel()
                : (new $.Deferred()).resolve();
        },

        _initPagination: function (options) {
            var report = this.component;
            var pagination = this.paginationView = new PaginationView(options);


            this.listenTo(pagination, "pagination:change", function (currentPage) {
                report.pages(currentPage).run().done(_.bind(function(){
                    // when event firing is off we still need to update pagination input.
                    pagination.options.silent && pagination.$el.find(".current").val(currentPage);
                }, this)).fail(_.bind(function(){
                    pagination.model.set("current", pagination.model.defaults.current);
                }, this)).always(_.bind(this._onReportRunFinished, this));
            });

            this.$content.before(pagination.render().$el);
        },

        _refreshPagination: function (totalPages, options) {
            var setOptions = {
                "total": totalPages
            };

            if(options && options.resetCurrent){
                setOptions.current = this.paginationView.model.defaults.current
            }
            // returns pagination validation into default state
            this.paginationView.resetSetOptions();
            this.paginationView.model.set(setOptions);
            this.paginationView.show();
        },

        _resetContentOverflow: function(overflow){
            var overflow = overflow || {};
            this.$content.css({
                "overflow-x": overflow.overflowX || "auto",
                "overflow-y": overflow.overflowY || "auto"
            });
        },

        _calculateContentOverflow: function(){
            var overflowX = "auto";
            var overflowY = "auto";

            var jrPage = this.$content.find(".jrPage");
            var jrPageW = jrPage.outerWidth();
            var jrPageH = jrPage.outerHeight();

            var contentW = this.$content.outerWidth();
            var contentH = this.$content.outerHeight();

            var scaleStrategy = this.model.get("scaleToFit");

            var scaleFactor = scaleStrategy !== 1 ? getScaleFactor(scaleStrategy, jrPageW, jrPageH, contentW, contentH) : 1;

            (contentW >= Math.floor(jrPageW * scaleFactor)) && (overflowX = "hidden");
            (contentH >= Math.floor(jrPageH * scaleFactor)) && (overflowY = "hidden");

            return {
                overflowX: overflowX,
                overflowY: overflowY
            }

        },

        _removePagination: function () {
            if (this.paginationView) {
                this.stopListening(this.paginationView);
                this.paginationView.remove();
                this.paginationView = null;
            }
        },

        _onComponentRendered: function(){
            var isChart = isAdhocChartReport(this);
            this.model.set("isAdhocChart", isChart);

            if (isChart) {
                this.model.set("scaleToFit", scaleStrategies.CONTAINER, { silent: true });
            }
        },

        _onReportRunFinished: function () {
            this.isReportRunning = false;
        },

        _onComponentPropertiesChange: function () {
            // Re-render report only when visual props have changed
            if (this.model.hasChanged("scaleToFit")) {
                this.component.scale(this.model.get("scaleToFit"));
                this._renderComponent();

                this._resetContentOverflow(this._calculateContentOverflow());
            }
        },

        _errorMessageFactory: reportErrorMessageFactory
    }
});
