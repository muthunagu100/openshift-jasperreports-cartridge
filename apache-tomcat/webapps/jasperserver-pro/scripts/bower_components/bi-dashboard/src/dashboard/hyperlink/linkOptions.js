/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: linkOptions.js 834 2014-10-15 10:09:57Z sergey.prilukin $
 */

define(function(require) {
    "use strict";

    var _ = require("underscore");

    function getComponent(component) {
        return typeof component === "function" ? component() : component
    }

    return function(component, linkOptions) {
        var options = _.extend({}, linkOptions);

        var events = {};

        //modify event handlers to use component as a context
        if (linkOptions) {
            if (linkOptions.events) {
                _.each(linkOptions.events, function(handler, name) {
                    events[name] = function() {
                        return handler.apply(getComponent(component), arguments);
                    }
                });
            }

            if (linkOptions.beforeRender) {
                options.beforeRender = function() {
                    linkOptions.beforeRender.apply(getComponent(component), arguments);
                }
            }
        }

        return _.extend(options, {events: events});
    }
});
