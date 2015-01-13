/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: domain.setup.main.js 6622 2014-09-19 08:28:27Z agodovanets $
 */

define(function(require) {
    "use strict";

    var domReady = require("!domReady"),
        resource = require("resource.base"),
        domain = require("domain.components"),
        domainWizard = require("domain.setup"),
        _ = require("underscore"),
        jrsConfigs = require("jrs.configs");

    require("domain.setup.dialogs");

    domReady(function(){
        _.extend(window, jrsConfigs.domainDesigner.localContext);
        _.extend(domain._messages, jrsConfigs.domainDesigner.domain._messages);
        _.extend(domainWizard, jrsConfigs.domainDesigner.domain.wizard);
        _.extend(resource, jrsConfigs.domainDesigner.resource);

        isIPad() && resource.initSwipeScroll();
        domainWizard.initialize();
    });
});
