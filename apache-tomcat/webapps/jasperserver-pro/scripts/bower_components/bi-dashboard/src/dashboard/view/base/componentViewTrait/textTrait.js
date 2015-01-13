/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: textTrait.js 404 2014-08-15 08:36:19Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var FreeTextView = require("../FreeTextView");

    return {
        _initComponent: function() {
            this.component = new FreeTextView({
                model: this.model,
                el: this.$content
            });
        },

        _onComponentPropertiesChange: function(){
            this._renderComponent();
        },

        _renderComponent: function() {
            this.component.render();
            this.trigger("componentRendered", this);
        },

        _removeComponent: function() {
            this.component.remove();
        }
    };
});
