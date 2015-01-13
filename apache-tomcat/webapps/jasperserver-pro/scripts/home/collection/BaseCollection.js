/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor.Nesterenko
 * @version: $Id: BaseCollection.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        DataProviderTrait = require("home/connectivity/trait/BackboneSyncTrait");
    return Backbone.Collection.extend(DataProviderTrait);
});