/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: controls.editoptions.js 6613 2014-07-18 09:12:59Z kklein $
 */

JRS.EditOptions = function (jQuery, _, Controls) {

    return  Controls.Base.extend({

        constructor:function (formSelector, reportOptionUri) {
            this.controlsController = new Controls.Controller({
                reportUri:reportOptionUri
            });

            this.viewModel = this.controlsController.getViewModel();
            this.controlsController.fetchControlsStructure();

            // Observe Edit Report Options Page
            var form = jQuery(formSelector);
            form.on("click", "button#done", _.bind(this.handleClick, this, form[0], "save"));
            form.on("click", "button#cancel", _.bind(this.handleClick, this, form[0], "cancel"));
        },

        handleClick:function (form, eventId, event) {
            event.preventDefault();
            form.method = "post";
            form._eventId.value = eventId;
            if(eventId == "cancel"){
                form.submit();
            }else if (eventId == "save"){
                this.controlsController.validate().then(_.bind(function (areControlsValid){
                    areControlsValid && this.submitForm(form)
                },this));
            }
        },

        submitForm:function (form) {
            var postData = this.viewModel.get('selection');
            if (postData) addDataToForm(form, postData);
            form.submit();
        }
    });

}(
    jQuery,
    _,
    JRS.Controls
);