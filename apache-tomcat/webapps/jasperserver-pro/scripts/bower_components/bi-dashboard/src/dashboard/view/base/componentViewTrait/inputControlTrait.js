/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: inputControlTrait.js 1027 2014-11-14 15:01:59Z ztomchenco $
 */

define(function(require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        InputControlCollection = require("bi/control/collection/InputControlCollection"),
        InputControlCollectionView = require("bi/control/view/InputControlCollectionView"),
        ParametersCache = require("../../../collection/ReportsParametersCollection").instance,
        InputControlPropertiesModel = require("bi/control/model/InputControlPropertiesModel"),
        inputControlWrapperTemplate = require("text!dashboard/template/inputControlWrapperTemplate.htm"),
        dashboardSettings = require("dashboard/dashboardSettings");

    function extractValuesFromRawState(state) {
        return !state.options ? state.value :
            _.reduce(state.options, function(memo, option){
                option.selected && memo.push(option.value);
                return memo;
            }, []);
    }

    return {
        template: _.template(inputControlWrapperTemplate),

        _onViewInitialize: function () {
            this.paramsModel = new Backbone.Model(this.model.get("params"));

            _.bindAll("notify");

            this.listenTo(this.model, "signal", function (payload) {
                if (_.isUndefined(payload.value)){
                    // components file content is updated before this, so its required to update it again.
                    // "changedControlProperties" event will be triggered
                    this.paramsModel.unset(payload.name, {trigger:true});
                } else {
                    this.paramsModel.set(payload.name, payload.value)
                }
            });

            this.listenTo(this.paramsModel, "change", function (model, options) {
                this.model.set("params", this.paramsModel.attributes);
                if (options && options.trigger){
                    this.model.collection.trigger("changedControlProperties", this.model);
                }

                var changedParameters = _.keys(model.changed);
                if (_.intersection(changedParameters, this.getDirectParameters()).length === changedParameters.length) {
                    // Workaround for IC service to work correctly in case if some controls were not added
                    var thisIdWithMissing = _.difference([this.model.getOwnerParameterName()].concat(this.model.get("masterDependencies")), _.keys(this.paramsModel.attributes));

                    this.inputControlCollection.updateState({
                        params: this.paramsModel.attributes
                    }, thisIdWithMissing);
                }
            });
        },

        _initComponent: function() {
            this.inputControlPropertiesModel = new InputControlPropertiesModel({
                resource: this.model.getOwnerUri(),
                server: dashboardSettings.CONTEXT_PATH
            });

            this.inputControlCollection = new InputControlCollection([], {
                stateModel: this.inputControlPropertiesModel
            });

            this.component = new InputControlCollectionView({
                collection: this.inputControlCollection,
                stateModel: this.inputControlPropertiesModel
            });

            this.component.setContainer(this.$el);

            this.listenTo(this.inputControlCollection, "changeState change:state", this.notify);

            // Workaround for IC service to work correctly in case if some controls were not added
            var initialParseState = this.inputControlCollection._parseState, name = this.model.getOwnerParameterName();
            this.inputControlCollection._parseState = function (state) {
                state.id === name && initialParseState.call(this, state);
            }
        },

        _renderComponent: function () {
            this.reset();
        },

        _removeComponent: function() {
            this.component.remove();
        },

        reset: function(){
            var collection = this.inputControlCollection,
                self = this,
                inputControlComponentModel = this.model;

            ParametersCache
                .getInputControlAsParameter(this.model.getOwnerUri(), this.model.getOwnerParameterName(), {full: this.model.get("fullCollectionRequired")})
                .done(function (control) {
                    var previousControl = collection.findWhere({id: control.id}),
                        isModelSet = collection.models && collection.models.length > 0,
                        isCurrentControlTypeSame = previousControl && control.type === previousControl.get("type");

                    if (isModelSet && isCurrentControlTypeSame) {
                        var model = collection.models[0];

                        if (!(model.state.isValue = !control.state.options) && model.state.options.models &&
                            model.state.options.models.length !== control.state.options.length) {

                            model.state.set("options", control.state.options);
                        }

                        model.changeState(extractValuesFromRawState(control.state));

                    } else {
                        var preparedControl = _.extend({}, control, {
                            label: inputControlComponentModel.get("label") || control.label,
                            slaveDependencies: []
                        });

                        delete preparedControl.state.error;

                        collection.reset([preparedControl]);
                    }

                    self.ready.resolve();
                });
        },

        getDirectParameters: function(){
            var result = [].concat(this.model.get("masterDependencies")),
                ownersUri = this.model.getOwnerUri(),
                ownersControls = this.model.collection.filter(function(component){
                return component.getOwnerUri && component.getOwnerUri() === ownersUri;
            });

            _.each(this.model.get("masterDependencies"), function (id) {
                var parentControl = ownersControls.find(function (control) {
                    return control.getOwnerParameterName() === id;
                });

                if (parentControl){
                    result = _.difference(result, parentControl.get("masterDependencies"));
                }
            });

            return result;
        },

        notify: function(){
            this.model.notify(this.inputControlCollection.models[0].state);
        }
    }
});