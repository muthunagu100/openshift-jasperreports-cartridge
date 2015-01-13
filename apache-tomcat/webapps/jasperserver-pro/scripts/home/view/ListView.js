/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: ListView.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        nothingToDisplayTemplate = require("text!home/template/nothingToDisplayTemplate.htm"),
        i18n = require("bundle!HomeBundle");

    return Backbone.View.extend({

        initialize: function(options) {

            this.subviews = [];
			this.initOptions = options; // save it because we need it below

            if (options){

                var defaultMessage = i18n["default.nothing.display"];
                this._msgNothingToDisplay = !options.msgNothingToDisplay ? defaultMessage : options.msgNothingToDisplay;

                if (options.fetchCollection) {
                    this.collection.fetch({ reset: true });
                }

            }

            this.collection.on("reset", this.render, this);
        },

        render: function () {

            var nothingToDisplayElement;

            if (this.collection.length > 0){
                //cleanup only for 'nothing' msg, no listeners to remove here
                this.$el.html("");

                this.collection.forEach(_.bind(function(model){
                    var view = new this.initOptions.listElementView({ model: model });
                    this.subviews.push(view);
                    this.$el.append(view.render().$el);
                },this));

            }else{
                nothingToDisplayElement = _.template(nothingToDisplayTemplate, {message: this._msgNothingToDisplay});
                this.$el.append(nothingToDisplayElement);
            }

            return this;
        }

    });
});