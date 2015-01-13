/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: MultiSelectWithTrueAllValueEditorAdapter.js 6614 2014-08-21 07:48:05Z yuriy.plakosh $
 */

define(function(require) {
    "use strict";

    var MultiSelectValueEditorAdapter = require("adhoc/filter/valueEditor/MultiSelectValueEditorAdapter"),
        MultiSelectWithTrueAll = require("common/component/multiSelect/view/new/MultiSelectWithTrueAllNew"),
        OlapFilterValueFormatter = require("adhoc/filter/format/OlapFilterValueFormatter"),
        filterValueFormatter = require("adhoc/filter/format/filterValueFormatter");

    return MultiSelectValueEditorAdapter.extend({
        createList: function() {
            return new MultiSelectWithTrueAll({
                getData: _.bind(this.model.dataProvider.getData, this.model),
                formatValue: this.model.isOlap
                    ? new OlapFilterValueFormatter(this.model.get("isFirstLevelInHierarchyAll")).format
                    : filterValueFormatter
            });
        },

        _setValueToList: function(options) {
            if (this.model.get("isAnyValue")) {
                this.list.setTrueAll(true);
            } else {
                this.list.setValue(this.getValue(), options);
            }
        }
    });
});
