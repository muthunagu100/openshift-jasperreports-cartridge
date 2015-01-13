/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: domain.designer.display.main.js 6622 2014-09-19 08:28:27Z agodovanets $
 */

define(function(require) {
    "use strict";

    var domReady = require("!domReady"),
        domain = require("domain.components"),
        domainDesigner = require("domain.designer.validators"),
        jrsConfigs = require("jrs.configs");

    require("domain.designer.display.validators");
    require("tools.drag");

    domReady(function(){
        if (typeof window.localContext === "undefined") {
            window.localContext = {};
        }
        _.extend(window.localContext, jrsConfigs.domainDesigner.localContext);

        _.extend(domain._messages, jrsConfigs.domainDesigner.domain._messages);

        domainDesigner.initialize();
    });
});
