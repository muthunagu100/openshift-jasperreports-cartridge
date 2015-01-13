/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko, Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var Backbone = require('backbone'),
        _ = require("underscore"),
        i18n = require('bundle!DashboardBundle'),
        baseToolbarTemplate = require('text!dashboard/template/toolbarTemplate.htm');

    require("css!dashboard/toolbar.css");

    return Backbone.View.extend({
        template: _.template(baseToolbarTemplate),

        el: function() {
            return this.template({ i18n: i18n });
        },

        initialize: function(options) {
            this.$title = this.$('.header .title');

            this.listenTo(this.model, 'change:label', this._updateLabel);
        },

        _updateLabel: function() {
            this.model && this.$title.text(this.model.get('label'));
        }
    });
});