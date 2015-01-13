/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: dashboard.designer.main.js 6622 2014-09-19 08:28:27Z agodovanets $
 */

define(function(require) {
    "use strict";

    var domReady = require("!domReady"),
        dashboardDesigner = require("dashboard.designer"),
        designerBase = require("designer.base"),
        baseControls = require("controls.base"),
        jrsConfigs = require("jrs.configs");

    require("json2");

    domReady(function() {
        if(window.Prototype) {
            delete Object.prototype.toJSON;
            delete Array.prototype.toJSON;
            delete Hash.prototype.toJSON;
            delete String.prototype.toJSON;
        }

        _.extend(dashboardDesigner, jrsConfigs.dashboardDesigner.localContext);
        _.extend(baseControls, jrsConfigs.inputControlConstants);

        designerBase.superInitAll();
    });
});