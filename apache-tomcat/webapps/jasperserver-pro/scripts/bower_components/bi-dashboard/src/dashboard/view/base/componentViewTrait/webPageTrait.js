/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: webPageTrait.js 435 2014-08-21 14:13:33Z tbidyuk $
 */

define(function (require) {
    "use strict";

    var $ = require("jquery"),
        WebPageView = require("common/component/webPageView/WebPageView");

    return {
        _initComponent: function() {
            this.component = new WebPageView({ url: this.model.get("url"), scrolling: this.model.get("scroll")});
            this.component.listenTo(this.model, "change:url", function(model, url){
                this.setUrl(url);
            });
        },

        _renderComponent: function() {
            this.component.render(this.$content);
            this.trigger("componentRendered", this);
        },

        _onComponentPropertiesChange: function() {
            var changedAttrs = this.model.changedAttributes();

            if (changedAttrs && "scroll" in changedAttrs) {
                this.component.setScrolling(this.model.get("scroll"));
                this.refresh();
            }
        },

        _removeComponent: function() {
            this.component.remove();
        },

        refresh: function() {
            this.component.refresh();
            return $.Deferred().resolve();
        }
    };
});
