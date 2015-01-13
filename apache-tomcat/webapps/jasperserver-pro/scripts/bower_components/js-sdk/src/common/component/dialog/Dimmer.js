/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author Andriy Godovanets
 */

define(function(require) {
    var $ = require("jquery"),
        classUtil = require("common/util/classUtil");

    var $dimmer, counter;

    return classUtil.extend({
        constructor: function(options) {
            if (!$dimmer) {
                counter = 0;
                $dimmer = $("<div id='dialogDimmer' class='dimmer'></div>").css(options);
                $(document.body).append($dimmer);
            }
            $dimmer.hide();
            counter++;
        },
        css: function(options) {
            $dimmer.css(options);
            return this;
        },
        show: function() {
            var dimmerCount = this.getCount() || 0;
            this.setCount(++dimmerCount);
            $dimmer.show();
            return this;
        },
        hide: function() {
            if (this.isVisible()) {
                var dimmerCount = this.getCount();
                this.setCount(--dimmerCount);
                !dimmerCount && $dimmer.hide();
                return this;
            }
        },

        setCount: function(value) {
            $dimmer.data({"count": value});
        },

        getCount: function() {
            return parseInt($dimmer.data("count"), 10);
        },

        isVisible: function() {
            return $dimmer.is(':visible');
        },

        remove: function() {
            if (this._removed) {
                return;
            }

            this._removed = true;
            if (!$dimmer) {
                return;
            }
            counter--;
            if (!counter) {
                $dimmer.remove();
                $dimmer = null;
            }
        }
});

});