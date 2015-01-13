/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: filterGroupTrait.js 954 2014-11-03 14:51:13Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var FilterGroupView = require("./../FilterGroupView"),
        dashboardSettings = require("../../../dashboardSettings");

    return {
        _initComponent: function() {
            this.component = new FilterGroupView({ model: this.model, el: this.$content });
        },

        _renderComponent: function() {
            this.$content.css("overflow-x", "hidden");

            this.component && this.component.render();

            // dashboardSettings.VISUALIZE_MODE is here for not show broken ICs in Viz.js mode
            if (dashboardSettings.VISUALIZE_MODE) {
                this.$content.hide();
                this.$(".filterGroupButtons").hide();
                this.showMessage({ errorCode: "not.supported.in.visualize" });
            }

            this._toggleButtons();

            this.trigger("componentRendered", this);
        },

        _resizeComponent: function() {
            this.component.resizeInputControlsWidth();
        },

        _removeComponent: function() {
            this.component.remove();
        },

        _toggleButtons: function() {
            this.component.enableButtons();
        },

        refreshFilterGroup: function() {
            this.component.refresh();
        }
    };
});
