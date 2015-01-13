/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: saveAsTopicMain.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function(require) {
    "use strict";

    var domReady = require("!domReady"),
        domain = require("domain.chooser.saveAsTopic"),
        jrsConfigs = require("jrs.configs"),
        _ = require("underscore"),
        dialogs = require("components.dialogs");

    domReady(function(){
        _.extend(domain._messages, jrsConfigs.dataChooser.domain._messages);
        _.extend(window.localContext, jrsConfigs.dataChooser.localContext);

        if(jrsConfigs.dataChooser.errorMessage) {
            dialogs.systemConfirm.show(jrsConfigs.dataChooser.errorMessage, 10000);
        }

        domain.chooser.initialize();
    });
});