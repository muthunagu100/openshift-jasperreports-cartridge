/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: commons.main.js 6622 2014-09-19 08:28:27Z agodovanets $
 */

define(function(require){

    "use strict";
    var domReady = require("!domReady");
    require("json3");
    require("commons.minimal.main");
    require("namespace");
    require("core.accessibility");
    require("core.events.bis");
    require("core.key.events");
	require("create.report");

    var actionModel = require("actionModel.modelGenerator"),
        primaryNavigation = require("actionModel.primaryNavigation"),
        globalSearch = require("repository.search.globalSearchBoxInit"),
        layoutModule = require("core.layout"),
        jrsConfigs = require("jrs.configs");

    domReady(function(){
        layoutModule.initialize();
        primaryNavigation.initializeNavigation(); //navigation setup
        actionModel.initializeOneTimeMenuHandlers(); //menu setup

        jrsConfigs.initAdditionalUIComponents && globalSearch.initialize();
        //isNotNullORUndefined(window.accessibilityModule) && accessibilityModule.initialize();

        //trigger protorype's dom onload manualy
        document.fire("dom:loaded");
    });

});
