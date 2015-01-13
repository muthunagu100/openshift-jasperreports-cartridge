/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: org.mng.actions.js 6622 2014-09-19 08:28:27Z agodovanets $
 */

orgModule.orgActionFactory = {
    'aliasExist': function(options) {
        var org = options.org;
        var data = {
            entityName: org.getNameWithTenant(),
            alias: org.alias
        };

        var action = new orgModule.ServerAction(orgModule.orgManager.Action.ALIAS_EXIST, data);

        action.onSuccess = function(data) {
            data.exist ? options.onExist && options.onExist(data.uniqueAlias) : options.onNotExist && options.onNotExist();
        };

        action.onError = function(data) {
            orgModule.fire(orgModule.Event.SERVER_ERROR, {
                inputData: options,
                responseData: data
            });
        };

        return action;
    }

};

orgModule.orgManager.actionFactory = {
};