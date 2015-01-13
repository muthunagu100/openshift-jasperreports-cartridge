/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author: Olesya Bobruyko
 * @version: $Id: Notification.js 280 2014-10-15 13:39:53Z ktsaregradskyi $
 */

define(function(require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('jquery'),
        Backbone = require('backbone'),
        i18n = require("bundle!CommonBundle"),
        notificationTemplate = require('text!./template/notificationTemplate.htm');

    require("css!notifications.css");

    var NOTIFICATION_TYPES = {
            SUCCESS: "success",
            WARNING: "warning"
        },
        NOTIFICATION_DEFAULT_DELAY = 2000,
        notificationTypeToCssClassMap = {};

    notificationTypeToCssClassMap[NOTIFICATION_TYPES.WARNING] = NOTIFICATION_TYPES.WARNING;

    return Backbone.View.extend({
        template: _.template(notificationTemplate),

        events: {
            "click .close a": "hide"
        },

        el: function() {
            return this.template({
                message: this.message,
                i18n: i18n
            });
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            $("body").append(this.$el);
            this.$el.hide();
            this.$messageContainer = this.$(".notificationMessage > span:first-child");

            return this;
        },

        show: function(options) {
            options = _.extend({
                type: NOTIFICATION_TYPES.WARNING,
                delay: NOTIFICATION_DEFAULT_DELAY
            }, options);

            this.$messageContainer.text(options.message);

            this.$messageContainer.removeClass().attr({"class": notificationTypeToCssClassMap[options.type]});

            this.$el.slideDown();

            _.delay(_.bind(this.hide, this), options.delay);

            return this;
        },

        hide: function(event) {
            event && event.preventDefault();

            this.$el.slideUp();

            return this;
        },

        remove: function() {
            Backbone.View.prototype.remove.call(this);
        }
    });
});