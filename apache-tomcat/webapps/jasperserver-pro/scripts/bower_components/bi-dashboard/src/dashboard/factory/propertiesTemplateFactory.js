/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function(require){
    "use strict";

    var dashboardSettings = require("dashboard/dashboardSettings"),

        dashboardPropertiesDialogTemplate = require("text!dashboard/template/properties/dashboardPropertiesDialogTemplate.htm"),
        filterPropertiesDialogTemplate = require("text!dashboard/template/properties/filterPropertiesDialogTemplate.htm"),

        // controls
        autoRefreshControlTemplate = require("text!dashboard/template/properties/controls/autoRefreshControlTemplate.htm"),
        showTitleBarElementsControlTemplate = require("text!dashboard/template/properties/controls/showTitleBarElementsControlTemplate.htm"),
        addressControlTemplate = require("text!dashboard/template/properties/controls/addressControlTemplate.htm"),
        scrollBarsControlTemplate = require("text!dashboard/template/properties/controls/scrollBarsControlTemplate.htm"),
        sourceDataControlTemplate = require("text!dashboard/template/properties/controls/sourceDataControlTemplate.htm"),
        sourceReportControlTemplate = require("text!dashboard/template/properties/controls/sourceReportControlTemplate.htm"),
        sourceAdHocViewControlTemplate = require("text!dashboard/template/properties/controls/sourceAdHocViewControlTemplate.htm"),
        scaleToFitControlTemplate = require("text!dashboard/template/properties/controls/scaleToFitControlTemplate.htm"),
        filtersPerRowControlTemplate = require("text!dashboard/template/properties/controls/filter/filtersPerRowControlTemplate.htm"),
        filterButtonsPositionControlTemplate = require("text!dashboard/template/properties/controls/filter/filterButtonsPositionControlTemplate.htm"),
        applyResetButtonControlTemplate = require("text!dashboard/template/properties/controls/applyResetButtonControlTemplate.htm"),
        textInputControlTemplate = require("text!dashboard/template/properties/controls/text/textInputControlTemplate.htm"),
        textFormattingControlTemplate = require("text!dashboard/template/properties/controls/text/textFormattingControlTemplate.htm"),

        basePropetiesDialogTemplate = require("text!dashboard/template/properties/basePropertiesDialogTemplate.htm"),

        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var templateByType = {};

    templateByType[dashboardComponentTypes.DASHBOARD_PROPERTIES] = [dashboardPropertiesDialogTemplate,
                                                                    autoRefreshControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.WEB_PAGE_VIEW] = [basePropetiesDialogTemplate,
                                                             addressControlTemplate,
                                                             showTitleBarElementsControlTemplate,
                                                             scrollBarsControlTemplate,
                                                             autoRefreshControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.REPORT] = [basePropetiesDialogTemplate,
                                                      sourceReportControlTemplate,
                                                      showTitleBarElementsControlTemplate,
                                                      scaleToFitControlTemplate,
                                                      autoRefreshControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.FREE_TEXT] = [basePropetiesDialogTemplate,
                                                         textInputControlTemplate,
                                                         textFormattingControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.FILTER_GROUP] = [basePropetiesDialogTemplate,
                                                            filtersPerRowControlTemplate,
                                                            applyResetButtonControlTemplate,
                                                            filterButtonsPositionControlTemplate

    ].join("\n");

    templateByType[dashboardComponentTypes.INPUT_CONTROL] = filterPropertiesDialogTemplate;

    templateByType[dashboardComponentTypes.ADHOC_VIEW] = [basePropetiesDialogTemplate,
                                                        sourceAdHocViewControlTemplate,
                                                        showTitleBarElementsControlTemplate,
                                                        scaleToFitControlTemplate,
                                                        autoRefreshControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.CROSSTAB] = [basePropetiesDialogTemplate,
                                                        sourceDataControlTemplate,
                                                        showTitleBarElementsControlTemplate,
                                                        scaleToFitControlTemplate,
                                                        autoRefreshControlTemplate
    ].join("\n");
    templateByType[dashboardComponentTypes.TABLE] = templateByType[dashboardComponentTypes.CROSSTAB];
    templateByType[dashboardComponentTypes.CHART] = templateByType[dashboardComponentTypes.CROSSTAB];

    function wrapTemplate(template){
        return '<div>' + template + '</div>';
    }

    return function(model) {
        var type;
        var template = (type = model.get("type")) in templateByType
                ? templateByType[type]
                : basePropetiesDialogTemplate;

        return wrapTemplate(template);
    };
});