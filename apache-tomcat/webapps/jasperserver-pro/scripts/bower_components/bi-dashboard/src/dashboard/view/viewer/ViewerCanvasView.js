/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi, Zakhar Tomchenko
 * @version: $Id: CanvasView.js 11 2014-08-22 13:49:12Z ktsaregradskyi $
 */

define(function(require, exports, module) {
    "use strict";

    var CanvasView = require("../base/CanvasView"),
        _ = require("underscore"),
        viewerCanvasTemplate = require('text!../../template/viewerCanvasTemplate.htm');

    return CanvasView.extend({
        template: _.template(viewerCanvasTemplate),

        showMessage: function(message){
            this.$(".panel.info.nothingToDisplay").removeClass("hidden").show().find(".message").html(message);
        },

        hideMessage: function(){
            this.$(".panel.info.nothingToDisplay").addClass("hidden").hide();
        }
    });
});
