/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: WiringProducerView.js 890 2014-10-22 08:26:38Z obobruyko $
 */

define(function (require) {
    "use strict";

    var ViewWithRivets = require("common/view/ViewWithRivets"),
        WiringConsumerCollectionView = require("./WiringConsumerCollectionView"),
        _ = require("underscore"),
        i18n = require("bundle!DashboardBundle"),
        i18n2 = require("bundle!CommonBundle"),
        dashboardComponentTypes = require("../../../enum/dashboardComponentTypes"),
        WiringSelectConsumerView = require("./WiringSelectConsumerView"),
        WiringConsumerViewModel = require("../../../model/filterManager/WiringConsumerViewModel"),
        WiringRemoveConsumerView = require("./WiringRemoveConsumerView"),
        wiringProducerTemplate = require("text!../../../template/filterManager/wiringProducerTemplate.htm");

    return ViewWithRivets.extend({
        constructor: function(options) {
            options.template = wiringProducerTemplate;
            options.i18n = _.extend(i18n2, i18n);

            ViewWithRivets.prototype.constructor.call(this, options);
        },

        initialize: function(options) {
            ViewWithRivets.prototype.initialize.call(this, options);

            this.selectConsumersCollectionView = new WiringConsumerCollectionView({
                collection: this.model.consumers,
                el: this.$(".selectConsumerColumn > .consumerTable > tbody"),
                modelView: WiringSelectConsumerView,
                modelViewOptions: { consumers: options.consumers }
            });

            this.removeConsumersCollectionView = new WiringConsumerCollectionView({
                collection: this.model.consumers,
                el: this.$(".removeConsumerColumn > .consumerTable > tbody"),
                modelView: WiringRemoveConsumerView
            });
        },

        render: function() {
            ViewWithRivets.prototype.render.apply(this, arguments);

            this.selectConsumersCollectionView.render();
            this.removeConsumersCollectionView.render();

            return this;
        },

        checkNewProducerName: function(e, ctx) {
            if (ctx.model.isValid(true)) {
                ctx.model.component.set("name", ctx.model.component.generateName(ctx.model.get("name")));

                var id = ctx.model.component.generateId();

                ctx.model.component.set("id", id);

                ctx.model.set({ parameter: id, id: id });
            }
        },

        removeProducer: function(e, ctx) {
            ctx.model.trigger('destroy', ctx.model, ctx.model.collection);
        },

        addConsumer: function(e, ctx) {
            ctx.model.consumers.add(new WiringConsumerViewModel({}, { collection: ctx.model.consumers }));
        },

        isValueModel: function() {
            return this.model.component.get("type") === dashboardComponentTypes.VALUE;
        },

        remove: function() {
            this.selectConsumersCollectionView.remove();
            this.removeConsumersCollectionView.remove();

            ViewWithRivets.prototype.remove.apply(this, arguments);
        }
    });
});
