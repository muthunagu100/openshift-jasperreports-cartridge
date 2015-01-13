/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: ChartJiveComponentView.js 2803 2014-10-28 20:05:30Z inesterenko $
 */

define(function (require) {
    "use strict";

    var BaseJiveComponentView =  require("./BaseJiveComponentView"),
        _ = require("underscore"),
        browserDetection = require("common/util/browserDetection"),
        $ = require("jquery");

    var
        opacityCssTransparent = {
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=30)",
            "filter": "alpha(opacity=30)",
            "opacity": "0.3"
        },
        opacityCssVisible = {
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "alpha(opacity=100)",
            "opacity": "1"
        };

        return BaseJiveComponentView.extend({
        _renderComponent: function($el) {
            var dfd = new $.Deferred();
            BaseJiveComponentView.prototype._renderComponent.call(this, $el);

            this.jiveChart = this.model.get("uiModuleType");

            if (this.jiveChart) {
                this.jiveChart.init(this.report);

                // fix top position of Chart Type button
                var wrapper = $el.find(".show_chartTypeSelector_wrapper").css({"top": "0"});
                if (!browserDetection.isIE8()) {
                    wrapper.css(opacityCssTransparent);
                }

                // fix top position of Chart Type dialog // - position calculating when opening dialog
                //$(".jive_chartTypeSelector").css("top", "5px");

                // make Chart Type selection button visible when active
                $el.find('.jive_chartSettingsIcon').on('mouseenter', function() {
                    if (!browserDetection.isIE8()) {
                        $(this).parent().css(opacityCssVisible);
                    }
                });

                // make Chart Type selection button transparent when not active
                $('.jive_chartMenu').on('mouseleave touchend', function() {
                    if (!browserDetection.isIE8()) {
                        $(this).parent().css(opacityCssTransparent);
                    }
                });

                // remove styles that are added manually to head in init method
                $("head #jive-chart-selector-stylesheet").remove();
            }

            dfd.resolve();

            return dfd;
        },

        setSize: function(width, height) {
            this.component && this.component.highchartsInstance && this.component.highchartsInstance.setSize(width, height, true);
        },

        remove: function() {
            this.jiveChart && this.jiveChart.destroyChartTypeSelector(this.report);

            BaseJiveComponentView.prototype.remove.call(this, arguments);
        }
    });
});

