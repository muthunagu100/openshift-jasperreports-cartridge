/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: type.LocalAnchor.js 839 2014-10-15 15:55:32Z sergey.prilukin $
 */

define(function(require) {
    "use strict";

    var reportExecution = require("./type.ReportExecution"),
        _ = require("underscore");

    return {
        beforeRender: function(linkToElemPairs) {
            reportExecution.beforeRender.call(this, linkToElemPairs);
        },
        click: function(ev, link) {
            //in case of local anchor href will looks like '#someanchor'
            //so we pass it as an '_anchor' parameter
            link.parameters = _.extend({}, link.parameters, {
                "_anchor": link.href.replace("#", "")
            });

            //Use same behaviour as in report execution
            //since we do not know how to execute local anchor through hyperlink
            reportExecution.click.call(this, ev, link);
        }
    }
});
