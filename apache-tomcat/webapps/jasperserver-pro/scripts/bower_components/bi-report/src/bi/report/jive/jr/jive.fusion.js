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
 * @version $Id: jive.fusion.js 2833 2014-11-09 15:19:31Z ktsaregradskyi $
 */

define(["require", "jquery", "./jasperreports-url-manager", "fusioncharts", "jrs.configs"], function(require, $, UrlManager, fusioncharts, jrsConfigs){
    var FusionElement = function(config) {
        this.config = config;
        this.parent = null;
        this.loader = null;

        //TODO: remove workaround after fixing url generation issues
        var swfUrl = this.config.instanceData.swfUrl;
        this.config.instanceData.swfUrl = jrsConfigs.contextPath + swfUrl.substring(swfUrl.indexOf("/fusion"));

        this.fusionInstance = null;
        this.events = {
            HYPERLINK_INTERACTION: "hyperlinkInteraction"
        };

        this._init();
    };

    FusionElement.prototype = {

        // internal API
        _init: function() {
            var it = this,
                instData = it.config.instanceData,
                fcConfig;

            /*
             FusionCharts.js will be loaded by requirejs from the fusion/maps folder;
             And that requires the charts and widgets to be configured to point to
             respective files relative to fusion/maps folder
             */
            FusionCharts.options.html5ChartsSrc = "../charts/FusionCharts.HC.Charts.js";
            FusionCharts.options.html5WidgetsSrc = "../widgets/FusionCharts.HC.Widgets.js";

            function dbg() {
                var i, args = arguments;
                for(i=0; i<args.length; i++) {
                    console.log(args[i]);
                }
            }

            //			FusionCharts.debugMode.enabled( dbg, 'verbose');

            if(!document.getElementById(instData.id)) {
                if (typeof window.printRequest === 'function') { //FIXME: is this still necessary?
                    window.printRequest();
                }

                fcConfig = {
                    id: instData.id,
                    swfUrl: instData.swfUrl,
                    width: instData.width,
                    height: instData.height,
                    debugMode: instData.debugMode,
                    registerWithJS: instData.registerWithJS,
                    renderAt: instData.renderAt,
                    allowScriptAccess: instData.allowScriptAccess,
                    dataFormat: instData.dataFormat,
                    dataSource: instData.dataSource
                };

                if (instData.rendererType === 'html5') {
                    fcConfig.renderer = 'javascript';
                }

                //remove instance if it already exists
                //to avoid memory leaks
                FusionCharts.items[fcConfig.id] && FusionCharts.items[fcConfig.id].dispose();

                it.fusionInstance = new FusionCharts(fcConfig);

                it.fusionInstance.addEventListener('BeforeRender', function(event, eventArgs) {
                    if (eventArgs.renderer === 'javascript') {
                        event.sender.setChartAttribute('exportEnabled', '0');
                    }
                });

                it.fusionInstance.addEventListener('JR_Hyperlink_Interception', function(event, eventArgs) {
                    var handler;
                    it.config.linksOptions.events && (handler = it.config.linksOptions.events.click);
                    handler && handler.call(this, event, eventArgs);

                    it._hyperlinkItemClicked(eventArgs);
                });

                it.fusionInstance.setTransparent(instData.transparent);
                it.fusionInstance.render();
            }
        },
        _hyperlinkItemClicked: function(hyperlinkData) {
            this._notify({
                name: this.events.HYPERLINK_INTERACTION,
                type: "hyperlinkClicked",
                data: {hyperlink: hyperlinkData}
            });
        },
        _notify: function(evt) {
            // bubble the event
            this.parent && this.parent._notify(evt);
        }
    };

    return FusionElement;
});
