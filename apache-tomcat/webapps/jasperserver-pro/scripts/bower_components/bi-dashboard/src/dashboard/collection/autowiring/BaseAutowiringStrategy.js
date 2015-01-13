/*
 * Copyright (C) 2005 - 2014 Tibco Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Andriy Godovanets
 * @version: $Id: BaseAutowiringStrategy.js 871 2014-10-20 09:38:41Z agodovanets $
 */

define(function(require) {
    var classUtil = require("common/util/classUtil");

    return classUtil.extend({
        autowire: function(collection, component, metadata) {},

        unwire: function(component) {}
    });
});