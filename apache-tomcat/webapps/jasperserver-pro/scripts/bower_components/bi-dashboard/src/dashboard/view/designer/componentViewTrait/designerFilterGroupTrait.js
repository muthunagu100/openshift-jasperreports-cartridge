/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Olesya Bobruyko
 * @version: $Id: designerFilterGroupTrait.js 1024 2014-11-13 18:28:39Z ztomchenco $
 */

define(function(require) {
    "use strict";

    var filterGroupTrait = require("../../base/componentViewTrait/filterGroupTrait"),
        _ = require("underscore");

    return _.extend({}, filterGroupTrait, {
        _initComponent: function() {
            this.model.isDesigner = true;
            filterGroupTrait._initComponent.apply(this, arguments);

            _.bindAll(this, "_onMouseDown");
            this.$content.on("mousedown", this._onMouseDown);
        },

        _onMouseDown: function(e) {
            var $component = this.$el.parent();

            if ($component.hasClass('ui-draggable')) {
                var contentOffsetLeft = this.$content.offset().left,
                    isScrollClick = e.pageX > contentOffsetLeft + this.scrollBarPosition.x2
                        && e.pageX < contentOffsetLeft + this.scrollBarPosition.x1;

                $component.draggable("option", "disabled", isScrollClick);
            }
        },

        _resizeComponent: function() {
            filterGroupTrait._resizeComponent.apply(this, arguments);

            this._getScrollBarPosition();
        },

        _getScrollBarPosition: function() {
            var initialOverflow = this.$content.css('overflow-y');
            this.scrollBarPosition = {
                x1: this.$content.css('overflow-y', 'hidden')[0].clientWidth,
                x2: this.$content.css('overflow-y', initialOverflow)[0].clientWidth
            };
        },

        _toggleButtons: function() {
            this.component.disableButtons();
        },

        _removeComponent: function() {
            filterGroupTrait._removeComponent.apply(this, arguments);

            this.$content.off("mousedown", this._onMouseDown);
        }
    });
});
