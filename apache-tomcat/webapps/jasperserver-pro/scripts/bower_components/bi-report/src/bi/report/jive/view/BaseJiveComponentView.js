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
 * @author: Igor Nesterenko
 * @version: $Id: BaseJiveComponentView.js 2803 2014-10-28 20:05:30Z inesterenko $
 */

define(function (require) {
    "use strict";

    var Backbone =  require("backbone"),
        $ = require("jquery"),
        _ = require("underscore"),
        log =  require("logger").register("Report");

    return Backbone.View.extend({
        initialize: function(options) {
            this.stateModel = options.stateModel;
            this.report = options.report;

            if (this.model.has("module")){
                this._discoverModuleType();
            }

            this.listenTo(this.model, "change:module", _.bind(this._discoverModuleType, this));

            log.debug("Create jive view", this);
        },

        render: function($el) {
            var dfd,
                renderDeferred = new $.Deferred();

            // it may happen that collection is absent (hasn't came from the server).
            // in this case we need to avoid rendering
            if (!this.model.collection) {
                renderDeferred.resolve();
                return renderDeferred;
            }

            if (!this.model.has("moduleType")){
                dfd = new $.Deferred();
                dfd.done(_.bind(function() {
                    this._renderComponent($el).done(function() {
                        renderDeferred.resolve();
                    });
                }, this));
                this.model.once("change:moduleType", dfd.resolve, dfd);
            }else{
                this._renderComponent($el).done(function() {
                    renderDeferred.resolve();
                });
            }

            return renderDeferred;
        },

        _renderComponent: function($el){
            var Module = this.model.get("moduleType"),
                dfd = new $.Deferred(),
                linkOptions = this.model.collection ? this.model.collection.linkOptions : null;

            this.component = new Module(linkOptions ? _.extend(this.model.toJSON(), {linkOptions: linkOptions}) : this.model.toJSON(), $el);

            if (this.component.render){
                this.component.render($el);

                if (!this.component.rdy) {
                    dfd.resolve();
                } else {
                    this.component.rdy.done(function() {
                        dfd.resolve();
                    });
                }
            } else {
                dfd.resolve();
            }

            return dfd;
        },

        _getModulesToLoad: function() {
            var modules = [];

            if (this.model.has("module")) {
                modules.push(addPrefix(this.model.get("module")));
                if (this.model.has("uimodule") && this.stateModel.isDefaultJiveUiEnabled()) {
                    modules.push(addPrefix(this.model.get("uimodule")));
                }
            }

            function addPrefix(m){
                if (m.indexOf("jive") === 0 ||
                    m.indexOf("adhocHighchartsSettingService") === 0 ||
                    m.indexOf("defaultSettingService")) {
                    //workaroud for jive paths
                    return "../jr/" + m;
                }
                return m;
            }

            return modules;
        },

        _discoverModuleType: function(){
            var self = this,
                modules = this._getModulesToLoad();

            require(modules, function(Module, UIModule){
                var obj = {};

                if (Module) {
                    obj.moduleType = Module;
                }

                if (UIModule) {
                    obj.uiModuleType = UIModule;
                }

                self.model.set(obj);
            });
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

});

