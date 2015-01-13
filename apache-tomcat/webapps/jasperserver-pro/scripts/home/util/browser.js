/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id: browser.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function () {

    "use strict";

    return {

        openInTab: function (url){
            var w = window.open();
            w.opener = null;
            w.document.location = url
        },

        open: function(url){
            location.href = url;
        }

    };
});