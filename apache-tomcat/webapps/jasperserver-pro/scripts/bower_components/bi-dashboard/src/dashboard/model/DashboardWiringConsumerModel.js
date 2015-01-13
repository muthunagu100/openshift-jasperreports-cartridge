/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: DashboardWiringConsumerModel.js 601 2014-09-19 08:54:36Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone");

    return Backbone.Model.extend({
        idAttribute: "consumer",

        defaults: {
            consumer: undefined
        }
    });
});
