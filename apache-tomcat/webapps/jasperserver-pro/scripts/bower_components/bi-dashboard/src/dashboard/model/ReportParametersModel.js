/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: ReportParametersModel.js 1008 2014-11-12 12:32:51Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        dashboardSettings = require("../dashboardSettings"),
        $ = require("jquery"),
        JSON = require("json3"),
        _ = require("underscore");

    function mergeControls(initial, loaded){
        var res;
        if (initial){
            res = initial;
            res.push.apply(res, _.filter(loaded, function(loaded){
                return !_.findWhere(initial, {id: loaded.id});
            }));
        } else {
            res = loaded;
        }

        return res;
    }

    return Backbone.Model.extend({

        idAttribute: "reportUri",

        defaults: {
            all: false
        },

        initialize: function(options, parameters){
            var self = this;
            this.stateDfds = {};

            if (parameters) {
                // pre-create deferreds to avoid additional calls in any case
                parameters.knownIds && _.each(parameters.knownIds, function (id) {
                    self.stateDfds[id] = new $.Deferred();
                });

                if (parameters.full){
                    this.allParamsDfd = new $.Deferred();
                    this.fetch({
                        full: true
                    }).fail(_.bind(this.allParamsDfd.reject, this.allParamsDfd));
                } else {
                    if (parameters.knownIds && parameters.knownIds.length){
                        this.fetch({
                            preload: parameters.knownIds
                        }).fail(function(){
                            var args = arguments;
                            _.each(parameters.knownIds, function (id) {
                                self.stateDfds[id].reject.apply(self.stateDfds[id], args);
                            });
                        });
                    }
                }

            }

            this.on("change:all", function(){
                self.allParamsDfd.resolve(self.get("inputControl"));
            })
        },

        url: function(){
            return dashboardSettings.CONTEXT_PATH + "/rest_v2/reports" + this.get("reportUri") + "/inputControls"
        },

        parse: function (data) {
            var self = this;
            if (data && data.inputControl) {
                var all = true;
                _.each(data.inputControl, function (control) {
                    if (control.uri.substr(0, 5) === "repo:") {
                        control.uri = control.uri.substr(5);
                    }

                    if (control.state){
                        self.stateDfds[control.id] || (self.stateDfds[control.id] = new $.Deferred());
                        self.stateDfds[control.id].resolve(control);
                        all = false;
                    }
                });

                data.all = all || this.get("full") || this.get("all");
                data.inputControl = mergeControls(this.get("inputControl"), data.inputControl);
            } else {
                data = {inputControl: [], all: true};
            }

            return data;
        },

        sync: function(method, model, options){
            if (method == 'read'){
                options.url = this.url();

                if (options.full){
                    model.set("full", true, {silent:true});
                } else {
                    if (options.preload){
                        options.url += "/" + options.preload.join(";");
                    } else {
                        options.url += "?exclude=state";
                    }
                }

                if (options.data){
                    if (_.isObject(options.data)){
                        options.data = JSON.stringify(options.data);
                    }

                    options.type = "POST";
                    options.processData = false;
                    options.headers = {"Content-Type": "application/json"};
                }
            }

            return Backbone.Model.prototype.sync.call(this, method, model, options);
        },

        getReportParameters: function(options){
            if (!this.allParamsDfd || (options && options.force)){
                this.allParamsDfd = new $.Deferred();
                this.stateDfds = {};
                this.unset("inputControl", {silent:true});
                this.set("all", false, {silent:true});
                this.fetch().fail(_.bind(this.allParamsDfd.reject, this.allParamsDfd));
            }
            return this.allParamsDfd.promise();
        },

        getInputControlAsParameter: function (controlName, options) {
            var res = this.stateDfds[controlName];

            if (!res || (options && options.force)){
                res = this.stateDfds[controlName] = new $.Deferred();
                this.fetch({preload: [controlName], data: options && options.params, full: options && options.full})
                    .fail(_.bind(this.stateDfds[controlName].reject, this.stateDfds[controlName]));
            }

            return res.promise();
        }

    });

});
