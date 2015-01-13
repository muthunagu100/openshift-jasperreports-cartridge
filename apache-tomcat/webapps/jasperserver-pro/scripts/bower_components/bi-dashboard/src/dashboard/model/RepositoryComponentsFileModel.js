/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: RepositoryComponentsFileModel.js 192 2014-05-29 14:04:42Z ztomchenco $
 */

define(function (require) {
    "use strict";

    var RepositoryFileModel = require("dashboard/model/RepositoryFileModel"),
        repositoryFileTypes = require("dashboard/enum/repositoryFileTypes"),
        base64 = require("base64"),
        json3 = require("json3"),
        _ = require("underscore");

    return RepositoryFileModel.extend({
        stringifyContent: true,

        defaults: (function() {
            return _.extend({}, RepositoryFileModel.prototype.defaults, {
                type: repositoryFileTypes.DASHBOARD_COMPONENTS_SCHEMA
            });
        })()
    });
});