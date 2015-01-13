/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: NumericValueEditor.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function(require) {
    "use strict";

    var numericTrait = require("adhoc/filter/valueEditor/numericTrait"),
        InputValueEditor = require("adhoc/filter/valueEditor/InputValueEditor");

    return InputValueEditor.extend(numericTrait);
});