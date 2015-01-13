/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: MultiSelectValueEditorAdapter.js 6614 2014-08-21 07:48:05Z yuriy.plakosh $
 */

define(function(require) {
    "use strict";

    var ListValueEditorAdapter = require("adhoc/filter/valueEditor/ListValueEditorAdapter"),
        MultiSelect = require("common/component/multiSelect/view/new/MultiSelectNew"),
        OlapFilterValueFormatter = require("adhoc/filter/format/OlapFilterValueFormatter"),
        filterValueFormatter = require("adhoc/filter/format/filterValueFormatter"),
        featureDetection = require("common/util/featureDetection");

    return ListValueEditorAdapter.extend({
        INITIAL_MAX_HEIGHT: 240,

        createList: function() {
            return new MultiSelect({
                getData: _.bind(this.model.dataProvider.getData, this.model),
                formatValue: this.model.isOlap
                    ? new OlapFilterValueFormatter(this.model.get("isFirstLevelInHierarchyAll")).format
                    : filterValueFormatter
            });
        },

        render : function() {
            ListValueEditorAdapter.prototype.render.apply(this, arguments);

            this.$el.append('<div class="sizer vertical ui-resizable-handle ui-resizable-s hidden"><span class="ui-icon ui-icon-grip-solid-horizontal"></span></div>');

            this._makeResizable();

            return this;
        },

        _makeResizable : function () {
            var $list = this.$('.sList');
            var $sizer = this.$('.sizer').removeClass('hidden'); // FF 3.6

            $list.resizable({
                handles: {
                    's': $sizer
                }
            });

            $list.one("resize", function(){
                var height = jQuery(this).height();
                jQuery(this).css("max-height", "").css("height", height);
            });

            //set max-height until resize will be done first time.
            $list.css("max-height", this.INITIAL_MAX_HEIGHT + "px");
        }
    });
});
