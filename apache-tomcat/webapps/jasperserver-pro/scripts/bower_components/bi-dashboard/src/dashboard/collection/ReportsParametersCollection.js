/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: ReportsParametersCollection.js 1054 2014-12-02 09:07:38Z psavushchik $
 */

define(function (require) {
    "use strict";

    var $ = require("jquery"),
        dashboardSettings = require("../dashboardSettings"),
        ReportParametersModel = require("../model/ReportParametersModel"),
        Backbone = require("backbone"),

    ReportParametersCollection =  Backbone.Collection.extend({
        model: ReportParametersModel,

        getReportParameters: function(uri, options){
            return this.add({
                reportUri:uri
            }).getReportParameters(options);
        },

        getInputControlAsParameter: function(reportUri, controlUri, options){
            return this.add({
                reportUri:reportUri
            }).getInputControlAsParameter(controlUri, options);
        }
    });

    ReportParametersCollection.instance = new ReportParametersCollection;

    return ReportParametersCollection;

});