/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function(require){
    "use strict";

    var addWebPageViewDialogContentTemplate = require("text!dashboard/template/addWebPageViewDialogContentTemplate.htm"),
        addTextDialogContentTemplate = require("text!dashboard/template/addTextDialogContentTemplate.htm"),
        addAdHocViewDialogContentTemplate = require("text!dashboard/template/addAdHocViewDialogContentTemplate.htm"),
        basePropertiesDialogTemplate = require("text!dashboard/template/properties/basePropertiesDialogTemplate.htm"),

        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var templateByType = {};

    templateByType[dashboardComponentTypes.WEB_PAGE_VIEW] = addWebPageViewDialogContentTemplate;
    templateByType[dashboardComponentTypes.FREE_TEXT] = addTextDialogContentTemplate;
    templateByType[dashboardComponentTypes.ADHOC_VIEW] = addAdHocViewDialogContentTemplate;
    templateByType[dashboardComponentTypes.TABLE] = addAdHocViewDialogContentTemplate;
    templateByType[dashboardComponentTypes.CHART] = addAdHocViewDialogContentTemplate;
    templateByType[dashboardComponentTypes.CROSSTAB] = addAdHocViewDialogContentTemplate;

    return function(model) {
        var type;
        var template = (type = model.get("type")) in templateByType
            ? templateByType[type]
            : basePropertiesDialogTemplate;

        return template;
    };
});