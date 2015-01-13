/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: dashboardComponentViewFactory.js 802 2014-10-09 13:23:04Z obobruyko $
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        ComponentView = require("../view/base/ComponentView"),
        DesignerComponentView = require("../view/designer/DesignerComponentView"),
        reportTrait = require("../view/base/componentViewTrait/reportTrait"),
        webPageTrait = require("../view/base/componentViewTrait/webPageTrait"),
        textTrait = require("../view/base/componentViewTrait/textTrait"),
        filterGroupTrait = require("../view/base/componentViewTrait/filterGroupTrait"),
        inputControlTrait = require("../view/base/componentViewTrait/inputControlTrait"),
        dashletTrait = require("../view/base/componentViewTrait/dashletTrait"),
        designerDashletTrait = require("../view/designer/componentViewTrait/designerDashletTrait"),
        designerInputControlTrait = require("../view/designer/componentViewTrait/designerInputControlTrait"),
        designerAdhocViewTrait = require("../view/designer/componentViewTrait/designerAdhocViewTrait"),
        designerFilterGroupTrait = require("../view/designer/componentViewTrait/designerFilterGroupTrait"),
        dashboardComponentTypes = require("../enum/dashboardComponentTypes");

    var viewerTypeToConstructorMap = {},
        designerTypeToConstructorMap = {};

    viewerTypeToConstructorMap[dashboardComponentTypes.WEB_PAGE_VIEW] = webPageTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.FILTER_GROUP] = filterGroupTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.FREE_TEXT] = textTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.INPUT_CONTROL] = inputControlTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.REPORT] = reportTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.ADHOC_VIEW] = reportTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.CROSSTAB] = reportTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.CHART] = reportTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.TABLE] = reportTrait;

    designerTypeToConstructorMap[dashboardComponentTypes.INPUT_CONTROL] = designerInputControlTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.CROSSTAB] = designerAdhocViewTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.CHART] = designerAdhocViewTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.TABLE] = designerAdhocViewTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.FILTER_GROUP] = designerFilterGroupTrait;

    function mixin(type, trait){
        for (var field in trait){
            if (type[field] && _.isFunction(type[field]) && _.isFunction(trait[field])){
                type[field] = combineFunctions(type[field], trait[field]);
            } else {
                type[field] = trait[field];
            }
        }
    }

    function combineFunctions(first, second){
        return function(){
            first.apply(this, arguments);
            return second.apply(this, arguments)
        }
    }

    return function(options, isDesigner) {
        var modelType = options.model.get("type"),
            typeMap = isDesigner && modelType in designerTypeToConstructorMap ? designerTypeToConstructorMap : viewerTypeToConstructorMap,
            trait = modelType !== dashboardComponentTypes.INPUT_CONTROL ? _.extend({}, isDesigner ? designerDashletTrait : dashletTrait) : {};

        mixin(trait, modelType in typeMap ? typeMap[modelType] : {});

        var baseConstructor = isDesigner ? DesignerComponentView : ComponentView,
            viewClass = baseConstructor.extend(trait);

        return new viewClass(options);
    };
});
