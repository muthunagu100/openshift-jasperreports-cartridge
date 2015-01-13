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
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: dashletTrait.js 981 2014-11-07 15:05:29Z obobruyko $
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        i18n = require("bundle!DashboardBundle"),
        log = require("logger").register(module),
        dashletTemplate = require("text!../../../template/dashletTemplate.htm"),
        dashboardComponentTypes = require("../../../enum/dashboardComponentTypes"),
        OptionContainer = require("common/component/option/OptionContainer"),
        dashletToolbarButtonTemplate = require("text!../../../template/dashletToolbarButtonTemplate.htm"),
        dashletToolbarTemplate = require('text!../../../template/dashletToolbarTemplate.htm');

    return {
        template: _.template(dashletTemplate),

        _onViewInitialize: function () {
            this.$dashlet = this.$("> .dashletContent");
            this.$content = this.$("> .dashletContent > .content");

            this.on("componentRendered", _.bind(this._toggleDashletToolbarButtons, this));
            this.on("componentRendered", function() { this.ready.resolve(); }, this);
        },

        _onViewRender: function () {
            // TODO: probably do resize on "componentRendered" event
            _.defer(_.bind(this.resize, this));

            this._setDashletVisualAppearance();

            if (this.model.isVisualization()) {
                this._initToolbar();

                this._setDashletToolbarVisualAppearance();
            }
        },

        _onViewResize: function () {
            this.$content.height(this.$dashlet.height() - 2 * this.dashboardProperties.get("dashletPadding") - (this.toolbar && this.toolbar.$el.is(":visible")
                ? this.toolbar.$el.outerHeight(true) : 0) - (this.paginationView && this.paginationView.$el.is(":visible") ? this.paginationView.$el.outerHeight(true) : 0)
                - ((this.component && this.component.$footer) && this.component.$footer.is(":visible") ? (!this.component.$footer.hasClass("fixed") ? this.component.$footer.outerHeight(true) : 0): 0));
        },

        refresh: function () {
            return $.Deferred().resolve();
        },

        cancel: function () {
            return $.Deferred().resolve();
        },

        _initToolbar: function () {
            this.toolbar && this.toolbar.remove();

            this.toolbar = new OptionContainer({
                options: [
                    {
                        cssClass: "maximizeDashletButton",
                        action: "maximize",
                        title: i18n["dashlet.toolbar.button.maximize"],
                        text: "",
                        disabled: true,
                        hidden: false
                    },
                    {
                        cssClass: "text cancelDashletButton",
                        action: "cancel",
                        title: i18n["dashlet.toolbar.button.cancel"],
                        text: i18n["dashlet.toolbar.button.cancel"],
                        hidden: true
                    },
                    {
                        cssClass: "refreshDashletButton",
                        action: "refresh",
                        title: i18n["dashlet.toolbar.button.refresh"],
                        text: "",
                        disabled: true,
                        hidden: false
                    }
                ],
                contextName: "button",
                contentContainer: ".buttons",
                mainTemplate: dashletToolbarTemplate,
                optionTemplate: dashletToolbarButtonTemplate
            });

            this.toolbar.$(".innerLabel > p").text(this.model.get("name"));

            this.listenTo(this.toolbar, "button:refresh", this._onRefreshClick);
            this.listenTo(this.toolbar, "button:maximize", this._onMaximizeClick);
            this.listenTo(this.toolbar, "button:cancel", this._onCancelClick);

            this.listenTo(this.model, "change:name", _.bind(function () {
                this.toolbar.$(".innerLabel > p").text(this.model.get("name"));
            }, this));

            this.$dashlet.prepend(this.toolbar.$el);
        },

        _setDashletToolbarVisualAppearance: function (changedAttrs) {
            if (this.toolbar) {
                this.toolbar[this.model.get("showTitleBar") ? "show" : "hide"]();
                this.toolbar.getOptionView("refresh")[this.model.get("showRefreshButton") ? "show" : "hide"]();
                this.toolbar.getOptionView("maximize")[this.model.get("showMaximizeButton") ? "show" : "hide"]();

                if (changedAttrs && ("showTitleBar" in changedAttrs)) {
                    this.resize();
                }
            }
        },

        _setDashletVisualAppearance: function () {
            if (!this.dashboardProperties.get("showDashletBorders")) {
                this.$dashlet.css("border-color", $(".dashboardCanvas").css("background-color"));
            } else {
                this.$dashlet.removeAttr("style");
            }

            var margin = this.dashboardProperties.get("dashletMargin");

            if (!this.dashboardProperties.get("showDashletBorders")) {
                try {
                    var borderWidth = parseInt(this.$dashlet.css("border-width"), 10);
                    margin -= isNaN(borderWidth) ? 0 : borderWidth;
                } catch (ex) {
                }
            }

            this.$el.css("padding", margin + "px");
            this.$content.css("padding", this.dashboardProperties.get("dashletPadding") + "px");
        },

        _onMaximizeClick: function () {
            if (this.model.isVisualization()) {
                this.trigger("maximize");
            }
        },

        _toggleDashletToolbarButtons: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").enable();
                this.toolbar.getOptionView("maximize").enable();
            }
        },

        _onRefreshClick: function (ev) {
            this._hideRefreshButton();

            this.refresh().always(_.bind(this._showRefreshButton, this));
        },

        _onCancelClick: function () {
            var self = this;
            this.cancel().done(function () {
                log.debug("canceled dashlet refresh");
                self._showRefreshButton();
            });
        },

        _enableRefreshButton: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").enable();
                this.toolbar.getOptionView("cancel").hide();
            }
        },

        _disableRefreshButton: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").disable();
                this.toolbar.getOptionView("cancel").show();
            }
        },

        _hideRefreshButton: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").hide();
                this.toolbar.getOptionView("cancel").show();
            }
        },

        _showRefreshButton: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").show();
                this.toolbar.getOptionView("cancel").hide();
            }
        },

        _errorMessageFactory: function(messageObj) {
            return i18n["dashboard.dashlet.error." + messageObj.errorCode];
        },

        showMessage: function (messageObj) {
            if (messageObj && messageObj.errorCode){
                var message = this._errorMessageFactory(messageObj);

                if (message) {
                    this.$(".nothingToDisplay").removeClass("hidden").show().find(".message").html(message);
                } else {
                    log.warn("Unhandled message: " + messageObj.toString());
                }
            }
        },

        hideMessage: function() {
            this.$(".nothingToDisplay").addClass("hidden").hide();
        },

        _onViewRemove: function () {
            this.toolbar && this.toolbar.remove();
        }
    };
});