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
 * @author: Zakhar Tomchenko, Kostiantyn Tsaregradskyi
 * @version: $Id: Dialog.js 380 2014-11-09 15:04:25Z ktsaregradskyi $
 */

define(function(require){
    "use strict";

    require("jquery.ui");

    var _ = require('underscore'),
        $ = require('jquery'),
        Dimmer = require("./Dimmer"),
        Panel = require("common/component/panel/Panel"),
        OptionContainer = require("common/component/option/OptionContainer"),

        resizablePanelTrait = require('common/component/panel/trait/resizablePanelTrait'),

        dialogTemplate = require('text!./template/dialogTemplate.htm'),
        dialogButtonTemplate = require("text!./template/dialogButtonTemplate.htm");

    var Dialog = Panel.extend({
        defaultTemplate: dialogTemplate,

        events: {
          "mousedown": "_focus",
          "touchstart": "_focus",
          "keydown": "_onKeyDown"
        },

        constructor: function(options) {
            options || (options = {});
            options.traits || (options.traits = []);

            this.resizable = options.resizable || false;
            this.modal = options.modal || false;

            if (this.resizable && _.indexOf(options.traits, resizablePanelTrait) === -1) {
                options.traits.push(resizablePanelTrait);
            }

            Panel.call(this, options);
        },

        initialize: function(options){
            this.collapsed = !this.collapsed;

            if(!_.isEmpty(options.buttons)) {
                this.buttons = new OptionContainer({options:options.buttons, el: this.$(".footer")[0], contextName:"button", optionTemplate: dialogButtonTemplate});
            }

            Panel.prototype.initialize.apply(this, arguments);

            // re-trigger button events on dialog itself
            this.buttons && this.listenTo(
                this.buttons,
                _.map(options.buttons, function(button) { return "button:" + button.action; }).join(" "),
                _.bind(function(buttonView, buttonModel) { this.trigger("button:" + buttonModel.get("action"), buttonView, buttonModel); }, this));

            this.render();
        },

        setElement: function(el){
            var res = Panel.prototype.setElement.apply(this, arguments);

            this.buttons && this.buttons.setElement(this.$(".footer")[0]);

            return res;
        },

        render: function(){
            this.$el.hide();

            if (this.modal) {
                this.dimmer = new Dimmer({zIndex: 900});
            }

            $("body").append(this.$el);

            this.$el.draggable({ handle: ".mover", addClasses: false, containment: "document"});

            return this;
        },

        open: function(coordinates){
            Panel.prototype.open.apply(this, arguments);

            this.modal && this.dimmer.css({ zIndex : ++Dialog.highestIndex }).show();

            this._position(coordinates)._increaseZIndex();

            // Class "over" is added to buttons on mouseover by some old prototype code.
            // Button may remain overed when dialog is closed and it will be displayed as overed when we will open
            // dialog again. That's why we need to remove class "over" when dialog is opened.
            this.buttons && this.buttons.$(".over").removeClass("over");

            this.$el.show();

            this.trigger("dialog:visible");

            return this;
        },

        close: function(){
            if (this.isVisible()) {
                this.$el.css({ zIndex: --Dialog.highestIndex });

                this.modal && this.dimmer.css({ zIndex: --Dialog.highestIndex }).hide();

                this.$el.hide();

                Panel.prototype.close.apply(this, arguments);

                return this;
            }
        },

        toggleCollapsedState: function() {
            return this;
        },

        enableButton: function(id){
            this.buttons.enable(id);
        },

        disableButton: function(id){
            this.buttons.disable(id);
        },

        isVisible: function() {
            return this.$el.is(":visible");
        },

        _position: function(coordinates){

            var top, left;
            var body = $("body"),
                elHeight = this.$el.height(),
                elWidth = this.$el.width();

            if(coordinates && typeof coordinates.top != "undefined" && typeof coordinates.left != "undefined"){
                top = coordinates.top;
                left = coordinates.left;

                var bodyHeight = body.height();
                var bodyWidth = body.width();

                var fitByHeight = bodyHeight - coordinates.top;
                var fitByWidth =  bodyWidth - coordinates.left;

                if(fitByHeight < elHeight){
                    top = coordinates.top - elHeight;
                    top = (top < 0) ? (bodyHeight/2 - elHeight/2) : top
                }
                if(fitByWidth < elWidth){
                    left = coordinates.left - elWidth;
                    left = (left < 0) ? (bodyWidth/2 - elWidth/2) : left
                }

            }else{
                top = $(window).height() / 2 - elHeight / 2;
                left = $(window).width() / 2 - elWidth / 2;
            }

            this.$el.css({
                top: top,
                left: left,
                position: "absolute"
            });

            return this;
        },

        _focus: function(){
           !this.modal && this._increaseZIndex();
        },

        _increaseZIndex: function() {
            this.$el.css({ zIndex : ++Dialog.highestIndex });
        },

        _onKeyDown: function(e){
            this.buttons._onKeyDown(e);
        },

        remove: function(){
            this.buttons && this.buttons.remove();

            this.dimmer && this.dimmer.remove();

            try {
                this.$el.draggable("destroy");
            } catch (e) {
                // destroyed already, skip
            }

            Panel.prototype.remove.call(this);
        }
    }, {
        highestIndex: 1000,
        resetHighestIndex: function(index){
            Dialog.highestIndex = index || 1000;
        }
    });

    return Dialog;

});
