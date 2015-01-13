/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: AdhocViewDashletModel.js 973 2014-11-05 13:02:00Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        log = require("logger").register(module),
        request = require("common/transport/request"),
        json3 = require("json3"),
        i18n = require("bundle!DashboardBundle"),
        VisualizationDashletModel = require("./VisualizationDashletModel"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        identityUtil = require("common/util/identityUtil"),
        generatedReports=  {}; // TODO: use sandbox instead

    function buildTemporaryUri(name) {
        return dashboardSettings.EMBEDDED_ADHOC_VIEW_TEMP_LOCATION + "/" + name;
    }

    return VisualizationDashletModel.extend({
        componentName: i18n['dashboard.component.adHoc.view.component.name'],

        getReportResourceUri: function() {
            var resourceUri = generatedReports[this.resource.resource.get("uri")] || generatedReports[this.get("resource")];

            if (!_.isUndefined(resourceUri)){
                this.componentInitializedDfd.resolve(resourceUri);
            } else {
                if (!this.componentInitializedDfd._running){
                    this.componentInitializedDfd._running = true;

                    log.debug("Started checking of report existence for " + this.resource.resource.get("uri"));

                    var self = this;
                    var dataSourceUri = this.resource.temporary
                        ? buildTemporaryUri(this.resource.resource.get("name"))
                        : this.resource.resource.get("uri");

                    request({
                        type: "POST",
                        headers: {
                            "Accept": "application/json"
                        },
                        processData: false,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        data: json3.stringify({
                            dataSourceUri: dataSourceUri,
                            label: "dashboardReport"
                        }),
                        url: dashboardSettings.CONTEXT_PATH + "/rest_v2/reportGenerators/custom-template"
                    }).fail(function(a, b, c) {
                        self.componentInitializedDfd.reject(a, b, c);
                    }).done(function(data) {
                        log.debug("Report for " + self.resource.resource.get("uri") + " is generated successfully");
                        generatedReports[self.resource.resource.get("uri")] = data.uri;
                        self.componentInitializedDfd.resolve(data.uri);
                    });
                }
            }

            return this.componentInitializedDfd.promise();
        },

        resetCaching: function() {
            this.componentInitializedDfd = new $.Deferred();
        },

        getDesignerUri: function() {
            var saveAsUri = this.isNew()
                    ? buildTemporaryUri(identityUtil.generateUniqueName("tmpAdv_"))
                    : encodeURIComponent(this.resource.resource.get("uri"));

            var pramsMap = {
                _flowId: "adhocFlow",
                decorate: "no",
                embeddedDesigner: "true",
                saveAsUri: saveAsUri,
                saveAsOverwrite: true,
                reportType: this.get("type")
            };

            this.isNew() || (pramsMap.embeddedName = encodeURIComponent(this.get("name")));
            this.resource && (pramsMap.resource = encodeURIComponent(this.resource.resource.get("uri")));

            return dashboardSettings.CONTEXT_PATH + "/flow.html?" + $.param(pramsMap);
        },

        isNew: function() {
            return typeof this.resource === "undefined";
        },

        _getDataSourceUri: function() {
            //collection of new visualization types which we can create right in dashboard
            var newVisualizationTypes = [
                dashboardComponentTypes.CROSSTAB,
                dashboardComponentTypes.CHART,
                dashboardComponentTypes.TABLE
            ];


            if (_.indexOf(newVisualizationTypes, this.get("type")) >= 0) {
                //special case: when model is one of new visualization types
                //we have to use other property for data source uri
                return (this.resource && this.resource.resource.get("dataSourceUri")) || this.get("dataSourceUri");
            } else {
                return VisualizationDashletModel.prototype._getDataSourceUri.call(this);
            }
        }
    });
});