/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: RepositoryJsonFileModel.js 94 2014-01-16 17:26:11Z ktsaregradskyi $
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
                type: repositoryFileTypes.JSON
            });
        })()
    });
});