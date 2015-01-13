/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: standardTypeExtensions.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function() {
    if (!Object.create) {
        Object.create = (function(){
            function F(){}

            return function(o){
                if (arguments.length != 1) {
                    throw new Error('Object.create implementation only accepts one parameter.');
                }
                F.prototype = o;
                return new F();
            }
        })();
    }
});