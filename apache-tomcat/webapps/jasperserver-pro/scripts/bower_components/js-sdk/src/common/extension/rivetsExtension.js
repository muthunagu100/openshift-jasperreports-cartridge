/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * Various extensions for Rivets library.
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: rivetsExtension.js 380 2014-11-09 15:04:25Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var rivets = require("rivets.original"),
        browserDetection = require("common/util/browserDetection"),
        _ = require("underscore"),
        Observable = require("iota-observable"),
        $ = require("jquery"),
        AttachableColorPicker = require("common/component/colorPicker/SimpleAttachableColorPicker");

    if(browserDetection.isIE8()){
        rivets.adapters['.'] = {
            subscribe: function(obj, keypath, callback) {
                obj.on(keypath, callback);
            },

            unsubscribe: function(obj, keypath, callback) {
                obj.off(keypath, callback);
            },

            read: function(obj, keypath) {
                return obj.get(keypath);
            },

            publish: function(obj, keypath, value) {
                obj.set(keypath, value);
            }
        };

        var originalBind = rivets.bind;

        rivets.bind = function(el, data){
           Observable.makeObservable(data);
           originalBind.apply(this, arguments);
        };
    }

    function determineEventsForInputBinding(el) {
        return $(el).is("select, :checkbox, :radio, :button, :file, :image, :submit")
            ? "change"
            :"keyup change";
    }

    function wrapElement(el){
        return el instanceof $ ? el : $(el);
    }

    rivets.configure({
        templateDelimiters: ['[[', ']]']
    });

    /**
     * @type {object}
     * @description Rivets adapter to work with Backbone.Model attributes.
     *      Validates (if corresponding function is available) property that was set.
     * @example
     *  <input type='text' rv-value='model:myAttr'/>
     */
    rivets.adapters[':'] = {
        subscribe: function(obj, keypath, callback) {
            return obj.on("change:" + keypath, callback);
        },
        unsubscribe: function(obj, keypath, callback) {
            return obj.off("change:" + keypath, callback);
        },
        read: function(obj, keypath) {
            return obj.get(keypath);
        },
        publish: function(model, keypath, value) {
            var setValueObj = {};
            setValueObj[keypath] = value;

            model.set(setValueObj);
            model.validate && model.validate(setValueObj);

            return model;
        }
    };

    /**
     * @type {object}
     * @description Rivets binder to add class 'error' to DOM element when corresponding model's attribute is invalid.
     *      In order to work model should be extended with Backbone.Validation.mixin.
     * @example
     *  <label rv-validation-error-class='model:myAttr'>
     *      <input type='text' rv-value='model:myAttr'/>
     *  </label>
     */
    rivets.binders['validation-error-class'] = {
        publishes: false,

        bind: function(el) {
            var model = this.view.models[this.keypath.split(":")[0]],
                attr = this.keypath.split(":")[1];

            this._onAttrValidated = function(model, attr, error) {
                wrapElement(el)[error ? "addClass" : "removeClass"]("error");
            };

            model.on("validate:" + attr, this._onAttrValidated);
        },

        unbind: function(el) {
            var model = this.view.models[this.keypath.split(":")[0]],
                attr = this.keypath.split(":")[1];

            model.off("validate:" + attr, this._onAttrValidated);
        },

        routine: function(el, value) {}
    };

    /**
     * @type {object}
     * @description Rivets binder to show error text inside DOM element when corresponding model's attribute is invalid.
     *      In order to work model should be extended with Backbone.Validation.mixin.
     * @example
     *  <span rv-validation-error-text='model:myAttr'></span>
     */
    rivets.binders['validation-error-text'] = {
        publishes: false,

        bind: function(el) {
            var model = this.view.models[this.keypath.split(":")[0]],
                attr = this.keypath.split(":")[1];

            this._onAttrValidated = function(model, attr, error) {
                wrapElement(el).text(error || "");
            };

            model.on("validate:" + attr, this._onAttrValidated);
        },

        unbind: function(el) {
            var model = this.view.models[this.keypath.split(":")[0]],
                attr = this.keypath.split(":")[1];

            model.off("validate:" + attr, this._onAttrValidated);
        },

        routine: function(el, value) {}
    };

    /**
     * @type {object}
     * @description Rivets binder react to both 'keyup' and 'change' events on input[type=text] and textarea tags.
     *      For node types that 'keyup' makes no sense (e.g. select), only 'change' event is used.
     * @extends Rivets.binder.value
     * @example
     *  <input type='text' rv-input='model:myAttr'></span>
     */
    rivets.binders['input'] =  {
        publishes: true,

        bind: function(el) {
            $(el).on(determineEventsForInputBinding(el), this.publish);
        },
        unbind: function(el) {
            $(el).off(determineEventsForInputBinding(el), this.publish);
        },
        routine: function(el, value) {
            rivets.binders.value.routine.call(this, el, value);
        }
    };

    /**
     * @type {object}
     * @description Rivets formatter to escape any special characters, before set into model.
     * @example
     *  <input type="text" rv-input="model:myAttr | escapeCharacters" >
     */
    rivets.formatters.escapeCharacters = {
        read: function(value){
            return $('<div/>').html(value).text();
        },
        publish: function(value) {
            return $('<div/>').text(value).html();
        }
    };

    /**
     * @type {object}
     * @description Rivets formatter to convert string values of input to integer, before set into model.
     * @example
     *  <input type="text" rv-input="model:myAttr | toInteger" >
     */
    rivets.formatters.toInteger = {
        publish: function(value) {
            return (isNaN(value * 1) || value === "") ? value : value*1;
        }
    };

    /**
     * @type {function}
     * @description Rivets formatter to prepend some text before binding. To pass multi-word text weap it in single quotes.
     * @example
     *  <select rv-title="model:myAttr | prependText 'multi-word text to prepend'"></select>
     *  <select rv-title="model:myAttr | prependText Single-Word"></select>
     */
    rivets.formatters.prependText = function(value, text) {
        if (text.charAt(0) === "'" && text.charAt(text.length - 1) === "'") {
            text = text.slice(1, text.length - 1);
        }

        return text + " " + (_.isUndefined(value) ? "" : value);
    };

    /**
     * @type {object}
     * @description Rivets binder to attach color picker to an element. Shows up when click on element. Shows color with help of "colorIndicator" css class if needed.
     * @example
     *   <div rv-colorpicker="model:myAttr" data-label="{{- i18n['dashboard.component.text.color.picker.background.color'] }}" data-show-transparent-input="true">
     *   <div class="colorIndicator"></div>
     * @attributes "data-label" - label of colorpicker. "data-show-transparent-input" - show additional input for transparent selection.
     */
    rivets.binders["colorpicker"] = {
        publishes: true,

        bind: function(el){
            var $el = wrapElement(el);
            var showTransparentInput = !!$el.data("showTransparentInput"),
                label = $el.data("label");

            this.attachableColorPicker = new AttachableColorPicker($el, {top: 5, left: 5}, {label: label, showTransparentInput: showTransparentInput});

            this.callback = function(color){
                var observer = this.observer;

                observer.publish(color);
            };

            this.attachableColorPicker.on("color:selected", _.bind(this.callback, this));
        },

        unbind: function(el){
            this.attachableColorPicker.off("color:selected", _.bind(this.callback, this));
            this.attachableColorPicker.remove();
        },

        routine: function(el, value) {
            var colorIndicator = wrapElement(el).find(".colorIndicator");
            this.attachableColorPicker.highlightColor(value);
            colorIndicator.css("background-color", value);
        }
    };

    /**
     * @type {object}
     * @description Rivets binder to make divs or other elements behave like radio button control. Uses "radioChild" css class to style child elements with "checked" class if needed.
     * @example
     *   <div rv-radio-div="model:myAttr" data-value="value">
     *      <span class="radioChild"></span>
     *   </div>
     * @attributes "data-value" - value of radio control.
     */
    rivets.binders["radio-div"] = {
        publishes: true,

        bind: function(el) {
            var $el = wrapElement(el);

            this.callback = function(){
                var observer = this.observer;
                var value = $el.data("value");

                observer.publish(value);
            };

            $el.on('click', _.bind(this.callback, this));
        },

        unbind: function(el) {
            wrapElement(el).off('click', _.bind(this.callback, this));
        },

        routine: function(el, value) {
            var $el = wrapElement(el);
            var radioDivs = $el.siblings("div[rv-radio-div]");
            if($el.data("value") === value){
                $el.addClass('checked');
                $el.children(".radioChild").addClass('checked');
                radioDivs.removeClass('checked');
                radioDivs.children(".radioChild").removeClass('checked');
            }
        }
    };

    /**
     * @type {object}
     * @description Rivets binder to make divs or other elements behave like checkbox control. Uses "checkboxChild" css class to style child elements with "checked" class if needed.
     * @example
     *  <div rv-checkbox-div="model:myAttr">
     *      <span class="checkboxChild"></span>
     *  </div>
     */
    rivets.binders["checkbox-div"] = {
        publishes: true,
        bind: function(el) {
            var $el = wrapElement(el);

            this.callback = function(){
                var observer = this.observer,
                    keypath = observer.key.path,
                    model = this.model;

                observer.publish(!model.get(keypath));
            };

            $el.on('click', _.bind(this.callback, this));
        },

        unbind: function(el) {
            wrapElement(el).off('click', _.bind(this.callback, this));
        },

        routine: function(el, value) {
            var $el = wrapElement(el);
            if(value){
                $el.addClass('checked');
                $el.children(".checkboxChild").addClass('checked');
            }else{
                $el.removeClass('checked');
                $el.children(".checkboxChild").removeClass('checked');
            }
        }
    };

    return rivets;
});