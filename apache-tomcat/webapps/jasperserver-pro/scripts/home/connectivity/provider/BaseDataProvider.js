/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id: BaseDataProvider.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function (require) {

    "use strict";

    var DataProvider = require("home/connectivity/provider/DataProvider"),
        Class = require("home/util/Class"),
        configs = require("jrs.configs"),
        $ = require("jquery"),
        commonRequestSettings = require("common/config/requestSettings");

    return Class(DataProvider).extend({


        getUrl : function(){
            return configs.contextPath +"/"+ this.url;
        },

        prepareRequestOptions: function(options){

            var ajaxOptions = {
                type: "GET",
                traditional: true,
                dataType: "json",
                url: this.getUrl()
            };

			if (this.extraRequestOptions) {
				ajaxOptions = _.extend(ajaxOptions, this.extraRequestOptions);
			}

            if (options && options.params){
                ajaxOptions.data = options.params;
            }

            return _.extend(commonRequestSettings, ajaxOptions);


        },

        fetch: function(options){

            var dfr = new $.Deferred(),
                ajaxOptions = this.prepareRequestOptions(options);

            $.ajax(_.extend(ajaxOptions, options))
                .done(function (dto) {
                    dfr.resolve(dto);
                })
                .fail(function (error) {
                    dfr.reject(error);
                });
            return dfr;

        }

    });
});