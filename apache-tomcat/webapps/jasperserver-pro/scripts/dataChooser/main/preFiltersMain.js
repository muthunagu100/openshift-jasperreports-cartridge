/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: preFiltersMain.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function(require) {
    "use strict";

    var domReady = require("!domReady"),
        domain = require("domain.chooser.filters"),
        jrsConfigs = require("jrs.configs"),
        _ = require("underscore");

    require("dateFormatter");

    domReady(function(){
        _.extend(domain._messages, jrsConfigs.dataChooser.domain._messages);
        _.extend(window.localContext, jrsConfigs.dataChooser.localContext);

        domain.chooser.initialize();
    });
});