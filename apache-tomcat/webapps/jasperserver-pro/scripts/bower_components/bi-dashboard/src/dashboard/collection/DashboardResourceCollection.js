/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: DashboardResourceCollection.js 305 2014-07-23 16:15:57Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        DashboardResourceModel = require("../model/DashboardResourceModel");

    return Backbone.Collection.extend({
        model: DashboardResourceModel
    });
});