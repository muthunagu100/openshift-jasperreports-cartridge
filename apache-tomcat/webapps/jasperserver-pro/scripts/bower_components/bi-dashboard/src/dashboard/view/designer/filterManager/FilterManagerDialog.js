/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author Andriy Godovanets, Kostiantyn Tsaregradskyi
 * @version $Id: FilterManagerDialog.js 910 2014-10-24 09:06:20Z obobruyko $
 */

define(function(require, exports, module) {
    "use strict";

    var CollectionView = require("./CollectionView"),
        Dialog = require("common/component/dialog/Dialog"),
        Tooltip = require("common/component/tooltip/Tooltip"),
        WiringProducerViewModelCollection = require("../../../collection/filterManager/WiringProducerViewModelCollection"),
        WiringProducerViewModel = require("../../../model/filterManager/WiringProducerViewModel"),
        WiringProducerView = require("./WiringProducerView"),
        ValueDashboardComponentModel = require("../../../model/component/ValueDashboardComponentModel"),
        types = require("../../../enum/dashboardComponentTypes"),
        dashboardComponentTypes = require("../../../enum/dashboardComponentTypes"),
        dashboardWiringStandardIds = require("../../../enum/dashboardWiringStandardIds"),
        _ = require("underscore"),
        viewRivetsTrait = require("common/view/trait/viewRivetsTrait"),
        filterManagerTemplate = require("text!../../../template/filterManager/filterManagerTemplate.htm"),
        i18n = require("bundle!DashboardBundle"),
        i18n2 = require("bundle!CommonBundle");

    function getConsumers(components) {
        var parameterConsumerComponents = components.filter(function(c) {
                return _.contains( [types.REPORT, types.ADHOC_VIEW, types.CROSSTAB, types.CHART, types.TABLE], c.get("type"))
                    && c.has("parameters") && c.get("parameters").length > 0;
            });

        return _.map(parameterConsumerComponents, function(component) {
            return {
                name: component.get("name"),
                id: component.get("id"),
                parameters: component.get("parameters")
            }
        });
    }

    return Dialog.extend({
        events: _.extend({
            "click a.addNewFilter": "addNewFilter"
        }, Dialog.prototype.events),

        constructor: function(options) {
            this.foundation = options.model;

            Dialog.prototype.constructor.call(this, {
                buttons: [
                    { label: i18n2["button.ok"], action: "ok", primary: true },
                    { label: i18n2["button.cancel"], action: "cancel", primary: false }
                ],
                title: i18n["dashboard.filter.manager.title"],
                additionalCssClasses: "filterManagerDialog",
                modal: true,
                resizable: false,
                content: new CollectionView({
                    template: filterManagerTemplate,
                    templateOptions: { i18n: i18n },
                    modelView: WiringProducerView,
                    modelViewOptions: { consumers: getConsumers(this.foundation.components) },
                    contentContainer: "tbody",
                    collection: new WiringProducerViewModelCollection()
                })
            });

            this.on("button:ok", this.applyWiringChanges);
            this.on("button:cancel", this.close);
        },

        applyWiringChanges: function() {
            if (this.content.collection.isValid(true)) {
                var self = this;

                var filterComponents = _.pluck(self.content.collection.models, "component"),
                    otherComponents = this.foundation.components.filter(function(component) {
                        return component.get("type") !== dashboardComponentTypes.INPUT_CONTROL
                            && component.get("type") !== dashboardComponentTypes.VALUE;
                    });

                this.foundation.components.set(filterComponents.concat(otherComponents));

                this.foundation.wiring.each(function(wiringModel) {
                    if (wiringModel.component.get("type") === dashboardComponentTypes.INPUT_CONTROL ||
                        wiringModel.component.get("type") === dashboardComponentTypes.VALUE) {

                        wiringModel.consumers.set(self.content.collection.get(wiringModel.get("component")).consumers.map(function(wiringConsumerModel) {
                            return { consumer: wiringConsumerModel.get("id") + ":" + wiringConsumerModel.get("parameter") };
                        }));
                    }
                });

                var refreshSignalWiring = this.foundation.wiring.findWhere({ name: dashboardWiringStandardIds.REFRESH_SIGNAL }),
                    componentsToApplyParamsTo = [];

                if (refreshSignalWiring) {
                    self.content.collection.each(function (wiringProducerModel) {
                        if (wiringProducerModel.component.getParent()) {
                            wiringProducerModel.consumers.each(function(wiringConsumerModel) {
                                var component = self.foundation.components.get(wiringConsumerModel.get("id"));

                                if (component.isVisualization() && component.get("type") !== dashboardComponentTypes.WEB_PAGE_VIEW) {
                                    componentsToApplyParamsTo.push(wiringConsumerModel.get("id"));
                                }
                            });
                        }
                    });

                    refreshSignalWiring.consumers.set(_.map(_.uniq(componentsToApplyParamsTo), function (componentId) {
                        return { consumer: componentId + ":" + dashboardWiringStandardIds.APPLY_SLOT };
                    }));
                }

                _.invoke(this.foundation.components.where({type: dashboardComponentTypes.FILTER_GROUP}), "notify", true);

                this.close();
            }
        },

        render: function() {
            Dialog.prototype.render.apply(this, arguments);

            Tooltip.attachTo(this.$el);

            return this;
        },

        open: function() {
            this.content.collection.reset(WiringProducerViewModelCollection.createFromDashboardWiringCollection(this.foundation.wiring, this.foundation.components).models);
            this.content._modelViewOptions = { consumers: getConsumers(this.foundation.components) };

            Dialog.prototype.open.call(this, { renderContent: true });
        },

        close: function() {
            this.content.collection.reset();

            Dialog.prototype.close.apply(this, arguments);
        },

        addNewFilter: function(evt){
            evt.stopPropagation();
            evt.preventDefault();

            var wiringProducerViewModel = new WiringProducerViewModel(),
                componentModel = new ValueDashboardComponentModel();

            componentModel.collection = this.foundation.components;
            componentModel.unset("id");
            componentModel.unset("name");
            componentModel.unset("label");

            wiringProducerViewModel.component = componentModel;

            this.content.collection.add(wiringProducerViewModel);
        }
    });
});
