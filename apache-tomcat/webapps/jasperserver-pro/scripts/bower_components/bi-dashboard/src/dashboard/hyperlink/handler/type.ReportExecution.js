/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: type.ReportExecution.js 865 2014-10-18 19:34:52Z sergey.prilukin $
 */

define(function(require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        jrsConfigs = require("jrs.configs"),
        $ = require("jquery"),
        uriTemplate = _.template("{{=context}}/flow.html?_flowId=viewReportFlow&reportUnit={{=report}}{{=parameters}}"),
        log = require("logger").register(module);

    return {
        beforeRender: function(linkToElemPairs) {
            _.each(linkToElemPairs, function(pair) {
                $(pair.element).css({cursor: "pointer"})
            })
        },
        click: function(ev, link) {
            //if _report is not defined assume we want to run this report
            var report = (link.parameters && link.parameters._report) || this.resource(),
                reducedParams = link.parameters ? _.omit(link.parameters, "_report") : {},
                paramsString = !_.isEmpty(reducedParams) ? "&" + $.param(reducedParams, true) : "",
                target = link.target ? "_" + link.target.toLowerCase() : "_self"; //_self is the default target in JRS

            if (target !== "_self") {
                window.open(uriTemplate({
                    context: jrsConfigs.contextPath,
                    report: encodeURIComponent(report),
                    parameters: paramsString
                }), target);
            } else {
                log.warn("Target type 'Self' not implemented for hyperlinks");
            }
        }
    }
});
