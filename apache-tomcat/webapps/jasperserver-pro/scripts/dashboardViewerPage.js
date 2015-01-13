/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function(require) {
    var webHelpModule = require("components.webHelp"),
        $ = require("jquery"),
        dashboardSettings = require('dashboard/dashboardSettings'),
        config = require("jrs.configs"),
        DashboardViewer = require("dashboard/DashboardViewer"),
        defaultLinkOptions = require("dashboard/hyperlink/defaultLinkOptions"),
        sandboxFactory = require("dashboard/factory/sandboxFactory");

    require("commons.main");

    dashboardSettings.CONTEXT_PATH = config.contextPath;
    webHelpModule.setCurrentContext("dashboard");

    // temporary fix to make sure that overrides_custom.css is loaded after all other CSS files
    $("link[href*='overrides_custom.css']").remove();

    require(["!domReady", "css!overrides_custom.css"], function(){
        var dashboardViewer = new DashboardViewer({
            el: '#display',
            contextPath: config.contextPath
        });

        var dashboardId = dashboardViewer.model.cid;
        sandboxFactory.get(dashboardId).set("linkOptions", defaultLinkOptions);
    });
});