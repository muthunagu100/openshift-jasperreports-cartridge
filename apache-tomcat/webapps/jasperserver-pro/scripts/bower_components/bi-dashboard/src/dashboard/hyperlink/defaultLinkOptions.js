/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: defaultLinkOptions.js 839 2014-10-15 15:55:32Z sergey.prilukin $
 */

define(function(require, exports, module) {
    "use strict";

    var HYPERLINK_MODULE_PREFIX = "type.";

    var _ = require("underscore"),
        log = require("logger").register(module),
        handlers = {};

    //PRE-load default hyperlink handlers
    require("type.LocalAnchor");
    require("type.LocalPage");
    require("type.Reference");
    require("type.RemoteAnchor");
    require("type.RemotePage");
    require("type.ReportExecution");

    function onHandlerLoaded(type, linkToElemPairs, hyperlinkHandler) {
        handlers[type] = hyperlinkHandler;

        if (hyperlinkHandler && typeof hyperlinkHandler.beforeRender === "function") {
            hyperlinkHandler.beforeRender.call(this, linkToElemPairs);
        }
    }

    function onLoadFailed(type, err) {
        var moduleId = err.requireModules && err.requireModules[0];
        if (moduleId) {
            log.error("Failed to load module: '" + moduleId + "' for handling hyperlinks of type: '" + type + "'!");
        }
    }

    return {
        events: {
            "click": function(ev, link) {
                var type = link.type,
                    handler = handlers[type];

                if (handler && typeof handler.click === "function") {
                    return handler.click.call(this, ev, link);
                }
            }
        },

        beforeRender: function (linkToElemPairs) {
            //PRE-load hyperlink handlers

            var pairsByType = {},
                self = this;

            //get unique list of link types
            _.each(linkToElemPairs, function(pair) {
                if (!pairsByType[pair.data.type]) {
                    pairsByType[pair.data.type] = [];
                }

                pairsByType[pair.data.type].push(pair);
            });

            //load modules to handle these types
            _.each(_.keys(pairsByType), function(type) {
                require([HYPERLINK_MODULE_PREFIX + type],
                    _.bind(onHandlerLoaded, self, type, pairsByType[type]),
                    _.partial(onLoadFailed, type));
            });
        }
    }
});
