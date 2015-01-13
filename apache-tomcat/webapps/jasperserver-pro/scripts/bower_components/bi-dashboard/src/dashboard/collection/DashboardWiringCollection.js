/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: DashboardWiringCollection.js 861 2014-10-18 13:17:42Z agodovanets $
 */

define(function (require) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        Backbone = require("backbone"),
        dashboardSettings = require("../dashboardSettings"),
        CascadeInputControlsAutowiringStrategy = require("./autowiring/CascadeInputControlsAutowiringStrategy"),
        OwnControlsAutowiringStrategy = require("./autowiring/OwnControlsAutowiringStrategy"),
        RunReportAutowiringStrategy = require("./autowiring/RunReportAutowiringStrategy"),
        DashboardWiringModel = require("../model/DashboardWiringModel");

    return Backbone.Collection.extend({
        model: DashboardWiringModel,

        initialize: function(){
            var self = this;

            _.bindAll(this, "register", "unregister");

            this.handlers = {};

            this.on("add", function(wiringModel) {
                wiringModel.consumers.each(_.bind(this.attachHandler, this, wiringModel));
            });

            this.on("remove", function(wiringModel) {
                wiringModel.consumers.set([]);
            });

            this.on("reset", function(collection, options) {
                _.each(options.previousModels, function(wiringModel) {
                    wiringModel.consumers.set([]);
                });

                this.each(function(wiringModel) {
                    wiringModel.consumers.each(_.bind(self.attachHandler, self, wiringModel));
                });
            });

            this.on("add:consumers", this.attachHandler);
            this.on("remove:consumers", this.detachHandler);
            this.on("reset:consumers", function(wiringModel, consumerCollection, options) {
                _.each(options.previousModels, _.bind(self.detachHandler, self, wiringModel));

                consumerCollection.each(_.bind(self.attachHandler, self, wiringModel));
            });

            this.autowiring = [];
            this.autowiring.push(new OwnControlsAutowiringStrategy());
            this.autowiring.push(new CascadeInputControlsAutowiringStrategy());
            this.autowiring.push(new RunReportAutowiringStrategy());
        },

        register: function (model, metadata) {
            var self = this;

            var addedModels = self.add(_.map(metadata.signals, function(name){
                return {
                    name: name,
                    producer: model.get("id") + ":" + name,
                    component: model.get("id")
                };
            }), {
                silent: true,
                component: model,
                consumers: []
            });

            for (var name in metadata.slots){
                var consumer = model.get("id") + ":" + name;
                this.handlers[consumer] || (this.handlers[consumer] = new $.Deferred());
                this.handlers[consumer].resolve(metadata.slots[name]);
            }

            this.autowiringEnabled && _.invoke(this.autowiring, "autowire", this, model, metadata);

            // We should trigger add event on the models after auto-wiring, because in opposite case
            // model will be in partial state - with not initialized consumers
            for (var i = 0, l = addedModels.length; i < l; i++) {
                (model = addedModels[i]).trigger('add', model, this);
            }
        },

        unregister: function (model) {
            var self = this,
                modelPart = model.get("id") + ":";

            this.remove(this.filter(function(connection) {
                return connection.get("producer").indexOf(modelPart) === 0;
            }));

            this.each(function(connection){
                var consumersToRemove = connection.consumers.filter(function(consumerModel){
                    return consumerModel.get("consumer").indexOf(modelPart) === 0;
                });

                _.each(consumersToRemove, function(consumerModel) {
                    connection.consumers.remove(consumerModel);
                    delete self.handlers[consumerModel.get("consumer")];
                })
            });

            _.invoke(this.autowiring, "unwire", model);
        },

        enableAutowiring: function(){
            this.autowiringEnabled = true;
        },

        disableAutowiring: function(){
            this.autowiringEnabled = false;
        },

        askForHandler: function(consumer){
            this.handlers[consumer] || (this.handlers[consumer] = new $.Deferred());
            return this.handlers[consumer].promise();
        },

        attachHandler: function(wiringModel, consumerModel) {
            this
                .askForHandler(consumerModel.get("consumer"))
                .done(function(handler) {
                    wiringModel.listenTo(wiringModel.component, wiringModel.get("name"), handler);

                    wiringModel.value && handler(wiringModel.value, wiringModel.component);
                });
        },

        detachHandler: function(wiringModel, consumerModel) {
            this
                .askForHandler(consumerModel.get("consumer"))
                .done(function(handler) {
                    wiringModel.stopListening(wiringModel.component, wiringModel.get("name"), handler);

                    wiringModel.value && handler(undefined, wiringModel.component);
                });
        }
    });
});