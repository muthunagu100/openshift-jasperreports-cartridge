/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author Andriy Godovanets
 * @version: $Id: observableRequest.js 6707 2014-10-13 13:48:39Z agodovanets $
 */

define(function(require) {
    var _ = require("underscore"),
        $ = require("jquery"),
        request = require("common/transport/request");

    // workaround for optimizer which usually runs in Node env without document defined
    if (typeof document === "undefined") {
        return {};
    }

    var $document = $(document);

    function triggerEvent() {
        $document.trigger.apply($document, arguments);
    }

    return function() {
        _.partial(triggerEvent, "request:before").apply(null, arguments);
        return request.apply(request, arguments)
            .done(_.partial(triggerEvent, "request:success"))
            .fail(_.partial(triggerEvent, "request:failure"));
    }
});

