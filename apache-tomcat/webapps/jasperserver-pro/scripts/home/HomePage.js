/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id: HomePage.js 6613 2014-07-18 09:12:59Z kklein $
 */

define(function (require) {

    "use strict";

    require("commons.main");

    var $ = require("jquery"),
        domReady = require("domReady"),
        HomeView = require("home/view/HomeView"),
        RootModel = require("home/model/RootModel"),
        rootModel = new RootModel(),
        homeView = new HomeView({model : rootModel});

    rootModel.fetch();

    domReady(function(){
        $("#display div.body").append(homeView.$el);
    });

});