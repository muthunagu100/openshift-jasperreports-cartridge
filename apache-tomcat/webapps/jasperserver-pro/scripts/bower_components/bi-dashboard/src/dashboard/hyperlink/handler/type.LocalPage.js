/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: type.LocalPage.js 839 2014-10-15 15:55:32Z sergey.prilukin $
 */

define(function(require) {
    "use strict";

    var localAnchor = require("./type.LocalAnchor"),
        _ = require("underscore");

    return {
        beforeRender: function(linkToElemPairs) {
            localAnchor.beforeRender.call(this, linkToElemPairs);
        },
        click: function(ev, link) {
            //Use same behaviour as in local anchor
            //since we do not know how to execute local page through hyperlink
            localAnchor.click.call(this, ev, link);
        }
    }
});
