/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: NumericRangeValueEditor.js 6614 2014-08-21 07:48:05Z yuriy.plakosh $
 */

define(function(require) {
    "use strict";

    var rangeTrait = require("adhoc/filter/valueEditor/rangeTrait"),
        NumericValueEditor = require("adhoc/filter/valueEditor/NumericValueEditor");

    return NumericValueEditor.extend(rangeTrait);
});