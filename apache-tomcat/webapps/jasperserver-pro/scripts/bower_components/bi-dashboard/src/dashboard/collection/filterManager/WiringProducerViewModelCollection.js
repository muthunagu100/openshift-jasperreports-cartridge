/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: WiringProducerViewModelCollection.js 799 2014-10-09 12:10:09Z ztomchenco $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        WiringProducerViewModel = require("../../model/filterManager/WiringProducerViewModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes");

    var WiringProducerCollection = Backbone.Collection.extend({
        model: WiringProducerViewModel,

        isValid: function(validate) {
            return _.every(this.invoke("isValid", validate), _.identity);
        }
    }, {
        createFromDashboardWiringCollection: function(dashboardWiringCollection, dashboardComponentCollection) {
            var inputControlProducers = dashboardWiringCollection.filter(function(wiringModel) {
                    return wiringModel.component.get("type") === dashboardComponentTypes.INPUT_CONTROL ||
                           wiringModel.component.get("type") === dashboardComponentTypes.VALUE ;
                }),
                producerModels = _.map(inputControlProducers, function(wiringModel) {
                    return WiringProducerViewModel.createFromDashboardWiringModel(wiringModel, dashboardComponentCollection);
                });

            return new WiringProducerCollection(producerModels);
        }
    });

    return WiringProducerCollection;
});
