/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: report.execution.count.js 6622 2014-09-19 08:28:27Z agodovanets $
 */

/*
 * module which checks report count executions count and show message if necessary
 */

JRS.reportExecutionCounter = (function ($, dialogs) {

    var REPORT_EXECUTION_COUNTER_URI = "reportExecutionCountMessage.html";

    var getCounter = function(callback) {
        $.ajax(REPORT_EXECUTION_COUNTER_URI, {
            dataType: "text"
        }).done(function(message) {
                callback && callback(message);
            });
    };

    var checkReportExecutionCount = function() {
        getCounter(function(message) {
            if (message) {

                if (document.getElementById('systemMessage')) {
                    dialogs.systemConfirm.showWarning(message, 5000);
                } else {
                    var count = 0;
                    var frameParent = window.parent;
                    while (count < 3 && frameParent && frameParent.document) {
                        if (frameParent.document.getElementById('systemMessage')) {
                            frameParent.dialogs.systemConfirm.showWarning(message, 5000);
                            return;
                        }

                        frameParent = frameParent.parent;
                        count++;
                    }

                    //Showing alert as last resort
                    alert(message);
                }
            }
        });
    };

    return {
        check: checkReportExecutionCount
    }
})(jQuery, window.dialogs);
