/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: type.RemotePage.js 839 2014-10-15 15:55:32Z sergey.prilukin $
 */

define(function(require) {
    "use strict";

    var reference = require("./type.Reference");

    return {
        beforeRender: function(linkToElemPairs) {
            reference.beforeRender.call(this, linkToElemPairs);
        },
        click: function(ev, link) {
            reference.click.call(this, ev, link);
        }
    }
});
