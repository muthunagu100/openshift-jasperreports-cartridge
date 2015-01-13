/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
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
 * @author: Igor Nesterenko, Kostiantyn Tsaregradskyi
 * @version: $Id: ReportView.js 2833 2014-11-09 15:19:31Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),
        jiveTypes = require("../jive/enum/jiveTypes"),
        reportCreators = require("../enum/reportCreators"),
        JiveComponentCollectionView = require("../jive/view/JiveComponentCollectionView"),
        reportOutputFormats = require("../enum/reportOutputFormats"),
        $ = require("jquery"),
        browserDetection = require("common/util/browserDetection"),
        reportEvents = require("../enum/reportEvents"),
        scaleStrategies = require("../enum/scaleStrategies"),
        domUtil = require("common/util/domUtil"),
        domReady = require("domReady"),
	    LoadingOverlay = require("common/component/overlay/LoadingOverlay"),
        LocalFrameView = require("common/component/frame/LocalFrameView");

    return Backbone.View.extend({

	    el: "<div style='height: 100%;'></div>",

	    $reportContainer: false,
	    $jrTables: false,
	    savedContainersOverflow: false,
        reportIsEmpty: false,

        initialize: function(options) {
            this.stateModel = options.stateModel;
            this.jiveComponentCollectionView = new JiveComponentCollectionView({
                collection: this.collection,
	            stateModel: options.stateModel
            });
	        // set the relative position to the our $el element
	        this.$el.css("position", "relative");
            this._afterResizeFunc = _.throttle(_.bind(this.applyScale, this), 500);
            $(window).on("resize", this._afterResizeFunc);
        },

        linkOptions: function(){
            return this.stateModel.get("linkOptions");
        },

        remove: function() {
            $(window).off("resize", this._afterResizeFunc);

	        // in case of isolated dom we might installed additional resize listener
	        if (this._setLocalFrameSize) {
		        $(window).off("resize", this._setLocalFrameSize);
		        this._setLocalFrameSize = false;
	        }

            this.jiveComponentCollectionView.remove();

            return Backbone.View.prototype.remove.call(this);
        },

	    setContainer: function(selector) {

		    var $reportContainer = $(selector), self = this;

		    if (!$reportContainer.length) {
			    return false;
		    }

		    $reportContainer.empty();

		    // since we emptied the container, he report which might be there is removed as well
		    this.$jrTables = false;

		    this.$reportContainer = $reportContainer;

		    // next, wait for the domReady event and append our $el into the container
		    this.containerAttachedToDOM = new $.Deferred();
		    domReady(function() {

			    if (self.stateModel.get("isolateDom")) {

				    self.localFrameView = new LocalFrameView();
                    self.$reportContainer.html(self.localFrameView.$el);

			    } else {

                    self.$reportContainer.html(self.$el);
				    self.showOverlay();
			    }

			    self.containerAttachedToDOM.resolve();
		    });

            return true;
	    },

        render: function() {
            var self = this,
                dfd = new $.Deferred();

	        this.containerAttachedToDOM.done(function() {

                if (self.stateModel.get("isolateDom")) {

                    self.renderIsolatedDom(dfd);

                } else {

                    self.renderReport();

                    // the report is empty, nothing to do
                    if (this.reportIsEmpty) {
                        dfd.resolve();
                        return;
                    }

	                // get back the loading overlay since it was removed by rendering
	                self.showOverlay();
                    self.renderJive().done(function() { dfd.resolve(); });
                }
            });

            return dfd;
        },

        renderIsolatedDom: function(dfd) {
            var self = this;

	        var onceAddedCallback = function() {

		        self.localFrameView.$el.width("100%");

		        if (self.isElasticChart()) {

			        self._setLocalFrameSize = _.throttle(function() {
				        var containerHeight = self.$reportContainer.height();
                        self.localFrameView.$el.height(containerHeight || 400);
			        }, 100);

			        self._setLocalFrameSize();
			        $(window).resize(self._setLocalFrameSize);
		        }

		        self.renderReport();

                // the report is empty, nothing to do
                if (self.reportIsEmpty) {
                    dfd.resolve();
                    return;
                }

		        self.renderJive().done(function() { dfd.resolve(); });
	        };

            this.localFrameView.add(this.$el, onceAddedCallback);
        },

        renderReport: function () {
            var output = this.model
                    .getExport(reportOutputFormats.HTML)
                    .getHTMLOutput(),
                elastic = this.isElasticChart(),
                $output = $(output);

            if (output) {

                this.reportIsEmpty = false;

                this.stateModel.get("linkOptions") && processLinks(this, $output);

                if (elastic) {
                    $output = $output
                        .find(".highcharts_parent_container")
                        .clone()
                        .css({
                            "margin": "0 auto",
                            "height": "100%"
                        });

                    // Dirty hack to make pie chart rendering to work. Is done because of adhocHighchartsSettingService.js
                    $output = $("<div></div>")
                        .append($output)
                        .append("<table cellpadding='0' cellspacing='0' class='jrPage'></table>")
                        .html();
                }

                this.$el.html($output);
                this.trigger(reportEvents.BEFORE_RENDER, this.$el[0]);

                var containerToFindIn = this.$reportContainer;

                // need to show scrollbar to properly calculate scale factor
                this.loadingOverlay && this.loadingOverlay.showScrollBarOnContainer();

                if (this.stateModel.get("isolateDom")) {
                    containerToFindIn = this.localFrameView.$frameBody;
                }
                this.$jrTables = containerToFindIn.find(elastic ? "._jr_report_container_" : "._jr_report_container_ > table");

                if (_.isUndefined(this.model.execution.get("scale"))) {
                    this.model.execution.set("scale", this.isElasticChart() ? scaleStrategies.CONTAINER : 1);
                }
                this.applyScale();
            } else {
                // means the report is not found, we need to empty the container
                this.reportIsEmpty = true;
                this.$el.empty();
            }
            return this;
        },

        renderJive: function() {
            var self = this,
                dfd = this.jiveComponentCollectionView.render(this.$el);
            dfd.then(function(){
                self.hideOverlay();
            });
            return dfd;
        },

        showOverlay: function() {

	        var self = this, continueShowing = function() {

		        if (self.stateModel.get("loadingOverlay") === false) {
			        return;
		        }
		        if (!self.$reportContainer) {
			        return;
		        }

		        var biComponentContainer = self.$el;
		        if (self.stateModel.get("isolateDom")) {
			        biComponentContainer = self.localFrameView.$frameBody;
		        }

		        if (!self.loadingOverlay) {
			        self.loadingOverlay = new LoadingOverlay({
				        propertiesModel: self.stateModel,
				        scaleFactor: self.scaleFactor,
				        externalContainer: self.$reportContainer,
				        biComponentContainer: biComponentContainer,
				        biComponent: self.$jrTables
			        });
		        } else {
			        // bi component and container are changing all the time, so we need to update them each time we are going to render the overlay
			        self.loadingOverlay.setExternalContainer(self.$reportContainer);
			        self.loadingOverlay.setBiComponentContainer(biComponentContainer);
			        self.loadingOverlay.setBiComponent(self.$jrTables);
			        self.loadingOverlay.setScaleFactor(self.scaleFactor);
		        }

		        self.loadingOverlay.show();
	        };

	        if (this.stateModel.get("isolateDom")) {
		        // wait till local frame will be loaded as well
		        this.localFrameView.frameLoaded.done(continueShowing);
	        } else {
		        continueShowing();
	        }
        },

        hideOverlay: function() {
	        if (!this.loadingOverlay) {
		        return;
	        }

	        this.loadingOverlay.hide();
        },

        applyScale: function() {
            if (!this.$jrTables) {
                return;
            }

            var scale = this.stateModel.get("scale");
            if (_.isUndefined(scale)) {
                scale = this.isElasticChart() ? scaleStrategies.CONTAINER : 1;
            }

            if (_.contains(_.values(scaleStrategies), scale)) {
                this._resizeTo(scale);
                return;
            }

            // on the other hand, it can be a number or a percent
            var hasPercent = /^\d+%$/.test(scale);
            scale = parseFloat(scale.toString().replace(",", "."));
            if (_.isNaN(scale)) {
                return;
            }
            if (hasPercent) {
                scale = scale / 100;
            }

            this._applyScaleTransform(scale);
        },

        _applyScaleTransform: function(scaleFactor) {

	        this.scaleFactor =  scaleFactor;

	        if (this.loadingOverlay) {
		        this.loadingOverlay.applyScale(scaleFactor);
	        }

            var css = this._getCssRulesForScalingFactor(scaleFactor);
	        this.$jrTables.css(css);

            _.invoke(this.jiveComponentCollectionView.scalableSubviews(), "scale", scaleFactor);

            if (this.stateModel.get("isolateDom")) {

                // if frame has width less than report has, then increase the width of the frame
                if (this.localFrameView.$el.width() < (this.$jrTables.width() * scaleFactor)) {
                    this.localFrameView.$el.width(this.$jrTables.width() * scaleFactor);
                }

                // set the height of the frame the same as report has minus 5 (which is iframe hidden margin)
                this.localFrameView.$el.height(this.$jrTables.height() * scaleFactor - 5);
            }
        },

	    _getCssRulesForScalingFactor: function(scaleFactor) {
		    var scale = 'scale(' + scaleFactor + ")", origin = "top left";
            var css = {
			    '-webkit-transform': scale,
			    '-moz-transform': scale,
			    '-ms-transform': scale,
			    '-o-transform': scale,
			    'transform': scale,
			    '-webkit-transform-origin': origin,
			    '-moz-transform-origin': origin,
			    '-ms-transform-origin': origin,
			    '-o-transform-origin': origin,
			    'transform-origin': origin
		    };

            // transform: scale, analog for IE8 and lower.
            if(browserDetection.isIE8()){
                css.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + scaleFactor + ", M12=0, M21=0, M22=" + scaleFactor + ", SizingMethod='auto expand')";
            }

            return css;
	    },

        _resizeTo: function(scaleStrategy) {

            if (this.isElasticChart()) {

                this._applyScaleTransform(1);
                this._autoScaleFontsEnabled() && this._setAutoScaleFonts();
                var chartParent = this.$jrTables.parents();
                _.invoke(this.jiveComponentCollectionView.sizableSubviews(), "setSize", chartParent.width(), chartParent.height());

            } else {

                var jrWidth = this.$jrTables.width(),
                    jrHeight = this.$jrTables.height(),
                    cWidth = this.$reportContainer.width(),
                    cHeight = this.$reportContainer.height() || 400,
                    scaleFactor = getScaleFactor(scaleStrategy, jrWidth, jrHeight, cWidth, cHeight);

                if (domUtil.isScrollable(this.$reportContainer[0])) {

                    var scrollbarSize = domUtil.getScrollbarWidth();

                    if (scaleStrategy === scaleStrategies.CONTAINER || scaleStrategy === scaleStrategies.WIDTH) {

                        // if the new height of the report will be more than height of the container
                        // then we need to decrease the scaleFactor to leave some space for vertical scroll on the right side
                        if (scaleFactor * jrHeight > cHeight) {
                            cWidth -= (scrollbarSize + 1);
                            scaleFactor = getScaleFactor(scaleStrategy, jrWidth, jrHeight, cWidth, cHeight);
                        }
                    }

                    if (scaleStrategy === scaleStrategies.CONTAINER || scaleStrategy === scaleStrategies.HEIGHT) {

                        // if the new width of the report will be more than width of the container
                        // then we need to decrease the scaleFactor to leave some space for horizontal scroll on the bottom
                        if (scaleFactor * jrWidth > cWidth) {
                            cHeight -= (scrollbarSize + 1);
                            scaleFactor = getScaleFactor(scaleStrategy, jrWidth, jrHeight, cWidth, cHeight);
                        }
                    }
                }

                this._applyScaleTransform(scaleFactor);
            }
        },

	    isElasticChart: function() {
		    return this.collection.some(function (component) {
			    return  reportCreators.AD_HOC_DESIGNER === component.get("creator") &&
				    jiveTypes.CHART === component.get("type");
		    });
	    },

        _autoScaleFontsEnabled: function() {
            return this.collection.some(function (component) {
                return component.get("hcinstancedata").services[0].data.chartState.autoScaleFonts;
            });
        },

        _setAutoScaleFonts: function () {
            var fontSize = parseInt(this.$jrTables.css("font-size")),
                width = this.$jrTables.width(),
                scale = width > 600 ? 1 : ((Math.floor(width / 100) + 4) / 10),
                scaledSize = Math.round(fontSize * scale);

            fontSize !== scaledSize && this.$jrTables.find(".highcharts_parent_container").css("font-size", scaledSize);
        }
    });

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

    function processLinks(view, $markup) {
        var links = view.model.components.getLinks();

        var linkOptions = view.linkOptions();
        if (linkOptions.beforeRender && links.length) {
            linkOptions.beforeRender(_.map(links, function(hyperlinkData) {
                return {
                    element: $markup.find("[data-id='" + hyperlinkData.id + "']")[0],
                    data: hyperlinkData
                }
            }));
        }

        if (linkOptions.events && links.length) {
            view.events = _.reduce(_.keys(linkOptions.events), function(events, eventName) {
                events[eventName + " ._jrHyperLink"] = processLinkEventHandler(links, view.stateModel.get("linkOptions").events[eventName]);
                return events;
            }, {});

            view.delegateEvents();
        }
    }

    function processLinkEventHandler(links, handler){
        return function(event){
            handler.call(this, event, _.findWhere(links, {id: event.currentTarget.getAttribute("data-id")}));
        }

    }

});