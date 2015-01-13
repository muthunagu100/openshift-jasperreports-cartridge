/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: dashboardComponentModelFactory.js 1058 2014-12-05 14:22:34Z ktsaregradskyi $
 */

define(function(require){
    "use strict";

    var DashletModel = require("dashboard/model/component/DashletModel"),
        InputControlDashboardComponentModel = require("dashboard/model/component/InputControlDashboardComponentModel"),
        PropertiesDashboardComponentModel = require("dashboard/model/component/PropertiesDashboardComponentModel"),
        ReportDashletModel = require("dashboard/model/component/ReportDashletModel"),
        AdhocViewDashletModel = require("dashboard/model/component/AdhocViewDashletModel"),
        WebPageDashletModel = require("dashboard/model/component/WebPageDashletModel"),
        TextDashletModel = require("dashboard/model/component/TextDashletModel"),
        VisualizationDashletModel = require("dashboard/model/component/VisualizationDashletModel"),
        FilterGroupDashletModel = require("dashboard/model/component/FilterGroupDashletModel"),
        ValueDashboardComponentModel = require("dashboard/model/component/ValueDashboardComponentModel"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var typeToConstructorMap = {};
    typeToConstructorMap[dashboardComponentTypes.WEB_PAGE_VIEW] = WebPageDashletModel;
    typeToConstructorMap[dashboardComponentTypes.FREE_TEXT] = TextDashletModel;
    typeToConstructorMap[dashboardComponentTypes.FILTER_GROUP] = FilterGroupDashletModel;
    typeToConstructorMap[dashboardComponentTypes.CHART] = AdhocViewDashletModel;
    typeToConstructorMap[dashboardComponentTypes.CROSSTAB] = AdhocViewDashletModel;
    typeToConstructorMap[dashboardComponentTypes.TABLE] = AdhocViewDashletModel;
    typeToConstructorMap[dashboardComponentTypes.INPUT_CONTROL] = InputControlDashboardComponentModel;
    typeToConstructorMap[dashboardComponentTypes.VALUE] = ValueDashboardComponentModel;
    typeToConstructorMap[dashboardComponentTypes.DASHBOARD_PROPERTIES] = PropertiesDashboardComponentModel;
    typeToConstructorMap[dashboardComponentTypes.REPORT] = ReportDashletModel;
    typeToConstructorMap[dashboardComponentTypes.ADHOC_VIEW] = AdhocViewDashletModel;

    var createComponentObj = function(componentObj, dashboardResource){
        return {
            type: (componentObj.id && componentObj.resourceType !== dashboardComponentTypes.INPUT_CONTROL) ?
                componentObj.id :
                componentObj.type && componentObj.resourceType !== dashboardComponentTypes.INPUT_CONTROL ? componentObj.type : componentObj.resourceType,

            label: componentObj.label,
            resourceId: dashboardResource ? componentObj.id : undefined,
            resource: dashboardResource ? componentObj.uri : undefined
        }
    };

    var factoryFunction = function(componentObj, additionalOptions, options) {
        var componentObj = options && options.createComponentObj ? createComponentObj(componentObj, additionalOptions.resource) : componentObj;
        var constructor = componentObj.type in typeToConstructorMap
            ? typeToConstructorMap[componentObj.type]
            : DashletModel;

        return new constructor(componentObj, additionalOptions);
    };

    // hack to make Backbone.Collection#set method find idAttribute when factory function is used as model constructor
    factoryFunction.prototype.idAttribute = DashletModel.prototype.idAttribute;

    return factoryFunction;
});