/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
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
 * Pagination component.
 *
 * @author: Taras Bidyuk
 * @version: $Id: Pagination.js 380 2014-11-09 15:04:25Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        $ = require("jquery"),
        template = require("text!common/component/pagination/template/paginationContentTemplate.htm"),
        containerTemplate = require("text!common/component/pagination/template/paginationContainerTemplate.htm"),
        PaginationModel = require("./model/PaginationModel"),
        i18n = require("bundle!CommonBundle"),
        _ = require("underscore");

    require("css!pagination.css");

    var DEFAULT_SET_OPTIONS = {
        silent: false,
        validate: true
    };

    return Backbone.View.extend({
        template: _.template(template),

        el: containerTemplate,

        events: {
            "click button.toLeft.first": "firstPage",
            "click button.left.prev": "prevPage",
            "change input.current": "currentPage",
            "click button.right.next": "nextPage",
            "click button.toRight.last": "lastPage"
        },

        constructor: function(options){
            var options = options || {};

            this.options = _.extend({}, DEFAULT_SET_OPTIONS, _.pick(options, ["silent", "validate"]));

            this.model = new PaginationModel(options, this.options);

            this.listenTo(this.model, "validated:invalid", this.onError);
            this.listenTo(this.model, "change", this.render);

            Backbone.View.apply(this, arguments);
        },

        firstPage: function(){
            this.model.set("current", 1, this.options);
            this.trigger("pagination:change", this.model.get("current"));
        },

        prevPage: function(){
            var current = this.model.get("current");
            var step = this.model.get("step");
            this.model.set("current", current-step, this.options);
            this.trigger("pagination:change", this.model.get("current"));
        },

        currentPage: function(){
            this.model.set("current", (parseInt(this.$el.find(".current").val()) || this.model.get("current")), this.options);
            this.trigger("pagination:change", this.model.get("current"));
        },

        nextPage: function(){
            var current = this.model.get("current");
            var step = this.model.get("step");
            this.model.set("current", current+step, this.options);
            this.trigger("pagination:change", this.model.get("current"));
        },

        lastPage: function(){
            var total = this.model.get("total");
            this.model.set("current", total, this.options);
            this.trigger("pagination:change", this.model.get("current"));
        },

        onError: function(model, error){
            this.trigger("pagination:error", error);
        },

        hide: function(){
            this.$el.hide();
        },

        show: function(){
            this.$el.show();
        },

        resetSetOptions: function(options){
            this.options = options ? _.extend({}, DEFAULT_SET_OPTIONS, _.pick(options, ["silent", "validate"])) : DEFAULT_SET_OPTIONS;
        },

        render: function(){
            this.$el.html(this.template(_.extend({i18n: i18n}, this.model.toJSON())));
            return this;
        }
    });
});