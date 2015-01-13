/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: FreeTextView.js 639 2014-09-19 09:07:41Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone");

    function attributesToCss(model) {
        return {
            "text-align": model.get("alignment"),
            "font-weight": (model.get("bold") ? "bold" : "normal"),
            "font-style": (model.get("italic") ? "italic" : "normal"),
            "font-family": model.get("font") || "inherit",
            "font-size": model.get("size") + "px",
            "color": model.get("color"),
            "line-height": model.get("size") + "px",
            "background-color": model.get("backgroundColor")
        };
    }

    return Backbone.View.extend({
        initialize: function(){
            this.$el.css({
                "white-space": "nowrap",
                "text-overflow": "ellipsis",
                "overflow": "hidden"
            });
        },

        render: function() {
            this.$el
                .html(this.model.get("text"))
                .css(attributesToCss(this.model));

            return this;
        }
    });
});