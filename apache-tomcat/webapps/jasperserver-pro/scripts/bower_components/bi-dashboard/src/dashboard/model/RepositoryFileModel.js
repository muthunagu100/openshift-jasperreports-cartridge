/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: RepositoryFileModel.js 305 2014-07-23 16:15:57Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var ResourceModel = require("common/model/RepositoryResourceModel"),
        Backbone = require("backbone"),
        repositoryResourceTypes = require("common/enum/repositoryResourceTypes"),
        repositoryFileTypes = require("dashboard/enum/repositoryFileTypes"),
        base64 = require("base64"),
        json3 = require("json3"),
        _ = require("underscore");

    function encodeContent(content, stringify) {
        if (!_.isUndefined(content)) {
            if (stringify) {
                content = json3.stringify(content);
            }

            content = base64.encode(content);
        }

        return content;
    }

    function decodeContent(content, stringify) {
        try {
            if (/[A-Za-z0-9+/=]/.test(content)) {
                content = base64.decode(content);

                if (stringify) {
                    content = json3.parse(content);
                }
            }
        } catch(ex) { }

        return content;
    }

    return ResourceModel.extend({
        type: repositoryResourceTypes.FILE,
        stringifyContent: true,

        validation: (function() {
            var validation =  _.extend({}, ResourceModel.prototype.validation);

            delete validation.parentFolderUri;

            return validation;
        })(),

        defaults: _.extend({
            type: repositoryFileTypes.UNSPECIFIED,
            content: undefined
        }, ResourceModel.prototype.defaults),

        initialize: function(attrs) {
            ResourceModel.prototype.initialize.apply(this, arguments);

            this.content = decodeContent(this.get("content"), this.stringifyContent);

            this.on("change:content", function() {
                this.content = decodeContent(this.get("content"), this.stringifyContent);
            }, this);
        },

        setContent: function(content) {
            this.content = content;
            this.set("content", encodeContent(content,  this.stringifyContent), { silent: true });
        },

        fetchContent: function(options) {
            options || (options = {});

            var self = this;

            return Backbone.ajax(_.defaults(options, {
                type: "GET",
                url: this.url() + "?expanded=false",
                success: function(response) {
                    self.setContent(response);
                }
            }));
        }
    });
});