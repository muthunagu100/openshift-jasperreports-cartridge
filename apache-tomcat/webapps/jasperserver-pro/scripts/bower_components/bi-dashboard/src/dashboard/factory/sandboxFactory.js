/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: sandboxFactory.js 839 2014-10-15 15:55:32Z sergey.prilukin $
 */

define(function(require) {
    "use strict";

    var Sandbox = require("dashboard/Sandbox"),
        _ = require("underscore");

    return {
        get: _.memoize(function(key) {
            if (!key) {
                return null;
            }

            return new Sandbox();
        })
    }
});
