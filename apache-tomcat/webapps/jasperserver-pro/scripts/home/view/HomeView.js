/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author:  Kostiantyn Tsaregradskyi, Igor.Nesterenko
 * @version: ${Id}
 */

define(function(require) {
    "use strict";

    var Backbone = require("backbone"),
        $ = require("jquery"),
        //Views
        ExpandableBlock = require("home/view/ExpandableBlockView"),
        PopularLinkView = require("home/view/PopularLinkView"),
        ListView = require("home/view/ListView"),
        WorkflowView = require("home/view/WorkflowView"),
        ResourceView = require("home/view/ResourceView"),
        ResourceBlockListView = ListView.extend({ tagName: "ul", className:"resourceBlock-list"}),
        ResourceBlockTableView = ListView.extend({ tagName: "table", className:"resourceBlock-table"}),
        //Templates
        homeTemplate = require("text!home/template/homeTemplate.htm"),
        //i18n
        i18n = require("bundle!HomeBundle");

    return Backbone.View.extend({

        initialize: function() {

                var popularLinksView = new ResourceBlockListView({
                        collection: this.model.getContentReferences(),
                        listElementView: PopularLinkView
                    }),
                    recentItemsView = new ResourceBlockTableView({
                        collection: this.model.getResources(),
                        listElementView: ResourceView,
                        msgNothingToDisplay: i18n["recently.viewed.nothing.display"]
                    });

                this.popularLinksBlock = new ExpandableBlock({
                    title : i18n["popular.resources"],
                    stateKey: "homePagePopularLinksExpandableList",
                    $block: popularLinksView.$el

                });

                this.recentItemsBlock = new ExpandableBlock({
                    title : i18n["recently.viewed.items"],
                    stateKey: "homePageRecentlyViewedResourcesExpandableList",
                    $block: recentItemsView.$el
                });

                this.workflowsView = new ListView({
                    collection: this.model.getWorkflows(),
                    listElementView: WorkflowView,
                    className :  "workflowsBlock",
                    template: "",
                    tagName: "ul"
                });

            this.model.on("change", this.render, this);
        },

        render: function () {

            this.$el.append($(_.template(homeTemplate, this.model.toJSON())));

            this.$(".homeMain").append(this.workflowsView.$el);

            this.$(".homeSidebar-title").after(this.popularLinksBlock.render().$el);

            this.$(".homeSidebar").append(this.recentItemsBlock.render().$el);

            return this;
        }
    });
});