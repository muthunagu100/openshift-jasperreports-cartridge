/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor Nesterenko
 * @version: $Id: adhocToHighchartsAdapter.js 2882 2014-12-02 09:38:49Z psavushchik $
 */

/**
 * This adapter makes adoption of Ad Hoc data, metadata and chart state to Highcharts options.
 */

//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory, globalScope) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define([
                "underscore",
                "adhoc/chart/Highcharts",
                "adhoc/chart/highchartsDataMapper",
                "adhoc/chart/adhocDataProcessor"

        ],factory);
    } else {
        // Browser globals.
        globalScope.AdhocHighchartsAdapter = factory(_, Highcharts, highchartsDataMapper, AdhocDataProcessor);
    }
}(function (_, Highcharts, dataMapper, dataProcessor) {
    "use strict";

    //TODO: remove while moving to full AMD env

    var AdhocHighchartsAdapter = {
        /**
         * Generates Highcharts options based on query data and chart state. This method does not do rendering. It just
         * prepare the options for rendering.
         *
         * @param queryData the query data object.
         * @param chartState the chart state.
         * @param extraOptions the extra options.
         * @return {Object} the options object to be passed to Highcharts.Chart constructor.
         */
        generateOptions: function(queryData, chartState, extraOptions) {
	        chartState = _.cloneDeep(chartState);
	        queryData = _.cloneDeep(queryData);

            dataProcessor.load(queryData);
            dataProcessor.messages = extraOptions.messages;

            Highcharts.setOptions({
                lang: {
                    shortMonths: chartState.shortMonths
                }
            });

            var dataProcessorRow = dataProcessor.levelsToLevelNumbers(chartState.rowsSelectedLevels, 0);
            var dataProcessorCol = dataProcessor.levelsToLevelNumbers(chartState.columnsSelectedLevels, 1);

            extraOptions.chartState = chartState;
            extraOptions.metadata = queryData.metadata;

            return dataMapper.getHighchartsOptions(chartState.chartType, dataProcessorRow, dataProcessorCol,
                extraOptions);
        }
    };

    return AdhocHighchartsAdapter;

}, this));