/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */



define(function (require) {
    "use strict";

    var ViewWithRivets = require("common/view/ViewWithRivets");

    return ViewWithRivets.extend({
        initialize: function(options) {
            ViewWithRivets.prototype.initialize.apply(this, arguments);

            this.original = this.model;
            this.model = this.original.clone();
            this.originalState = this.model.clone();

            this.listenTo(this.original, "change", this._onOriginalModelChange);
        },

        _onOriginalModelChange: function(){
            var changedAttrs = this.original.changedAttributes();

            this.model.set(changedAttrs);
            this.model.validate(changedAttrs);
        }
    });
});