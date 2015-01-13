/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor Nesterenko
 * @version: $Id: Highcharts.js 2760 2014-10-17 08:41:17Z psavushchik $
 */

/**
 *  Extend Highcharts with plugin and extensions,
 */
//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define([
            "highcharts",
            "grouped-categories",
            "adhoc/chart/ext/multiplePieTitlesExt",
            "highcharts-more",
            "heatmap"
        ], factory);
    } else {
        // Browser globals.
        factory(Highcharts);
    }
}(function (Highcharts) {
    "use strict";

    return Highcharts;

}));