/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: type.Reference.js 865 2014-10-18 19:34:52Z sergey.prilukin $
 */

define(function(require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        log = require("logger").register(module),
        urlTemplate = _.template("{{=url}}{{=parameters}}{{=anchor}}");

    return {
        beforeRender: function(linkToElemPairs) {
            _.each(linkToElemPairs, function(pair) {
                $(pair.element).css({cursor: "pointer"})
            })
        },
        click: function(ev, link) {
                //_self is the default target in JRS
            var target = link.target ? "_" + link.target.toLowerCase() : "_self",

                //http://somehost?param=value#anchor ->
                //["http://somehost?param=value#anchor", "http://somehost", "?param=value", "#anchor"]
                urlParts = link.href.match(/^([^\?\#]+)(\?[^\#]+)?(\#.*)?$/),
                params = "",
                anchor = urlParts[3] || "";

                //merge url parameters and link params
                if (urlParts[2]) {
                    params += urlParts[2];
                }

                if (link.parameters) {
                    params += ((params ? "&" : "?") + $.param(link.parameters, true));
                }

            if (target !== "_self") {
                window.open(urlTemplate({
                    url: urlParts[1],
                    parameters: params,
                    anchor: anchor
                }), target);
            } else {
                log.warn("Target type 'Self' not implemented for hyperlinks");
            }
        }
    }
});
