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
 * @version $Id: jive.highcharts.js 2882 2014-12-02 09:38:49Z psavushchik $
 */

define(["require", "jquery", "underscore", "bundle!adhoc_messages", "highcharts-more", "logger", "heatmap"], function(require, $, _, i18n, HM, logger, Highcharts){
    var api = {
        changeType: {}
    };

    var log = logger.register("jive.highcharts");


    var HCChart = function(config) {
        this.rdy = new $.Deferred();
        this.config = config;
        this.parent = null;
        this.loader = null;
        this.api = api;
        this.highchartsInstance = null;
        this.events = {
            ACTION_PERFORMED: "action",
            HYPERLINK_INTERACTION: "hyperlinkInteraction"
        };

        this._init();
    };

    HCChart.prototype = {
        changeType: function(parms) {
            var it = this,
                payload = {
                    action: {
                        actionName: 'changeChartType',
                        changeChartTypeData: {
                            chartComponentUuid: it.config.id,
                            chartType: parms.type
                        }
                    }
                };

            return this.loader.runAction(payload).then(function(jsonData) {
                it._notify({
                    name: it.events.ACTION_PERFORMED,
                    type: "changeChartType",
                    data: jsonData
                });

                return it;
            });
        },
        render: function($el) {
            var it = this, msg;
            it.rdy.then(function() {
                try{
                    it.hcConfig.chart.renderTo = $("#"+it.hcConfig.chart.renderTo, $el)[0];
                    it.highchartsInstance = new Highcharts.Chart(it.hcConfig);
                } catch(e) {
                    if (/\#19/.test(e)) {
                        msg = i18n["ADH_1214_ICHARTS_ERROR_TOO_MANY_VALUES"];
                    } else {
                        msg = i18n["ADH_1214_ICHARTS_ERROR_UNCAUGHT"];
                    }

                    _.each(Highcharts.charts, function(chart) {
                        chart && it.hcConfig.chart.renderTo === chart.renderTo && chart.destroy();
                    });
                    if (it.highchartsInstance && it.highchartsInstance.destroy) {
                        it.highchartsInstance.destroy();
                        it.highchartsInstance = undefined;
                    }

                    it._notify({
                        name: "error",
                        type: "highchartsInternalError",
                        data: {
                            error: e,
                            message: msg
                        }
                    });
                }
            });
        },

        // internal functions
        _init: function() {
            // apply chart services asynchronously
            var it = this,
                instanceData = this.config.hcinstancedata;

            this.config.globalOptions && Highcharts.setOptions(this.config.globalOptions);

            it.hcConfig = {};

            var MasterDfd = new $.Deferred();
            MasterDfd.resolve();

            $.each(this.config.hcinstancedata.services, function(idx, entry) {
                var srv = entry.service;
                var srvData = entry.data;
                if ("dataSettingService" === srv) {
                    it.hcConfig = srvData;
                } else {
                    MasterDfd = MasterDfd.then(function() {
                        var DFD = new $.Deferred();
                        require(["../jr/" + srv], function(Service) {
                            if ('itemHyperlinkSettingService' === srv) {
                                var extData = _.extend({}, srvData, {linkOptions: it.config.linkOptions}),
                                    hService = new Service(it, it.hcConfig, extData);
                                hService.hyperlinkSeriesPointClickedHandler = it._hyperlinkSeriesPointClicked;

                                hService.perform();
                            } else {
                                Service.perform(it.hcConfig, srvData);
                            }
                            DFD.resolve();
                        });
                        return DFD;
                    });
                }
            });

            // create the actual Highcharts chart
            MasterDfd.then(function() {
                it.hcConfig.chart.renderTo = instanceData.renderto;
                it.hcConfig.chart.width = instanceData.width;
                it.hcConfig.chart.height = instanceData.height;

                it.rdy.resolve();
            });
        },
        _hyperlinkSeriesPointClicked: function(hyperlinkData) {
            this._notify({
                name: this.events.HYPERLINK_INTERACTION,
                type: "hyperlinkClicked",
                data: hyperlinkData
            });
        },
        _notify: function(evt) {
            // bubble the event
            this.parent && this.parent._notify(evt);
        }
    };

    return HCChart;
});
