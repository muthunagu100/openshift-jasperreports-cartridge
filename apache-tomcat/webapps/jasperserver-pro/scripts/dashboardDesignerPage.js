/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function(require) {
    var config = require("jrs.configs"),
        $ = require("jquery"),
        dashboardSettings = require('dashboard/dashboardSettings'),
        webHelpModule = require("components.webHelp"),
        expirationManager = require("session/expirationManager"),
        DashboardDesigner = require("dashboard/DashboardDesigner"),
        defaultLinkOptions = require("dashboard/hyperlink/defaultLinkOptions"),
        sandboxFactory = require("dashboard/factory/sandboxFactory");

    require("commons.main");

    dashboardSettings.CONTEXT_PATH = config.contextPath;

    expirationManager({timeoutWarningDelay: dashboardSettings.TIMEOUT_WARNING_DELAY});
    webHelpModule.setCurrentContext("dashboard");

    // temporary fix to make sure that overrides_custom.css is loaded after all other CSS files
    $("link[href*='overrides_custom.css']").remove();

    require(["!domReady", "css!overrides_custom.css"], function(){
        var dashboardDesigner = new DashboardDesigner({
            el: '#display',
            contextPath: config.contextPath
        });

        var dashboardId = dashboardDesigner.model.cid;
        sandboxFactory.get(dashboardId).set("linkOptions", defaultLinkOptions);
    });
});
