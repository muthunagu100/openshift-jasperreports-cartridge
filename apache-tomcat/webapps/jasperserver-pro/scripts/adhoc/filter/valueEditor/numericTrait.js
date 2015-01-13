/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: numericTrait.js 6614 2014-08-21 07:48:05Z yuriy.plakosh $
 */

define(function(require) {
    "use strict";

    var $ = require("jquery");

    return {
        /**
         * Additionally trim input
         * @param value
         * @returns {string}
         */
        valueConverter : function(value) {
            var normalizedValue = $.trim(value);
            return this._basicValueConverter(normalizedValue);
        }
    };
});
