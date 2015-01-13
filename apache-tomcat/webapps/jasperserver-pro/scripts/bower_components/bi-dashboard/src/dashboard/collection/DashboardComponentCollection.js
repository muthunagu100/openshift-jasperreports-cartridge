/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: DashboardComponentCollection.js 964 2014-11-04 10:53:23Z ktsaregradskyi $
 */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        log = require("logger").register(module),
        _ = require("underscore"),
        dashboardSettings = require("../dashboardSettings"),
        DashletModel = require("../model/component/DashletModel"),
        dashboardComponentTypes = require("../enum/dashboardComponentTypes"),
        dashboardComponentModelFactory = require("../factory/dashboardComponentModelFactory");

    function splitHtmlIntoArray(html) {
        var regexp = new RegExp(dashboardSettings.DASHLET_TEMPLATE, "g"),
            result = [],
            tmp;

        while(tmp = regexp.exec(html)) {
            result.push(tmp[0]);
        }

        return result;
    }

    function onComponentRemove(model) {
        if (model.isVisualization() && model.get("type") !== dashboardComponentTypes.WEB_PAGE_VIEW) {
            // after saving dashboard model.resource.resource.get("uri") will point to new URL, which won't work for already added controls
            var resource = model.get("resource"),
                inputControlsModels = this.where({ownerResourceId: resource}),
                otherReportsModels = this.where({resource: resource, type: model.get("type")});

            _.each(inputControlsModels, function(inputControlModel) {
                if (!otherReportsModels.length) {
                    this.remove(inputControlModel);
                }
            }, this);
        }
    }

    return Backbone.Collection.extend({
        model: dashboardComponentModelFactory,

        initialize: function() {
            this.on("remove", _.bind(onComponentRemove, this));
        },

        getSelectedComponent: function() {
            return this.findWhere({ selected: true });
        },

        selectComponent: function(componentId) {
            var componentModel = this.get(componentId);

            this.forEach(function(model) {
                if (model !== componentModel) {
                    model.set("selected", false);
                }
            });

            if (componentModel) {
                componentModel.set("selected", true);
            }
        },

        setPositionFromHtml: function(html) {
            try {
                var arr = splitHtmlIntoArray(html),
                    positionObjects = _.map(arr, function(div) { return DashletModel.htmlToPositionObject(div); });

                this.forEach(function(model) {
                    var position = _.findWhere(positionObjects, { id: model.id });

                    if (position) {
                        model.set(position, { silent: true });
                    }
                });
            } catch(e) {
                log.error(e);
            }
        },

        toHTML: function(setCssPosition) {
            var result = "";

            this.forEach(function(model) {
                if (model instanceof DashletModel) {
                    result += model.toHTML(setCssPosition);
                }
            });

            return result;
        },

        getDashboardPropertiesComponent: function() {
            return this.findWhere({ type: dashboardComponentTypes.DASHBOARD_PROPERTIES });
        },

        isOutOfCanvasBounds: function(position) {
            return position.x < 0
                || position.y < 0
                || (position.x + position.width) > dashboardSettings.GRID_WIDTH
                || (position.y + position.height) > dashboardSettings.GRID_HEIGHT;
        },

        overlaps: function(position, ignoreComponentId) {
            return this.some(function(componentModel) {
                if (componentModel instanceof DashletModel) {
                    if (ignoreComponentId === componentModel.get("id")) {
                        return false;
                    }

                    return !(componentModel.get("x") >= position.x + position.width ||
                        componentModel.get("x") + componentModel.get("width") <= position.x ||
                        componentModel.get("y") >= position.y + position.height ||
                        componentModel.get("y") + componentModel.get("height") <= position.y);
                } else {
                    return false;
                }
            });
        }
    });
});