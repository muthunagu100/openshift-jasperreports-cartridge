/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: editReportOptionMain.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function (require) {
    "use strict";

    var domReady = require("!domReady"),
        _ = require("underscore"),
        jrsConfigs = require("jrs.configs"),
        EditOptions = require("report/option/controls.editoptions"),
        Report = require("report.view"),
        ControlsBase = require("controls.base");

    domReady(function() {
        Report.reportUnitURI = jrsConfigs.Report.reportUnitURI;
        _.extend(ControlsBase, jrsConfigs.inputControlsConstants);

        var editOptions = new EditOptions("#reportOptionsForm", jrsConfigs.Report.reportOptionsURI);
    });
});
