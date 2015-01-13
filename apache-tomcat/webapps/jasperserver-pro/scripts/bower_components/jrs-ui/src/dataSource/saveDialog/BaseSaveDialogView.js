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
 * @author: Dima Gorbenko
 * @version: $Id: BaseSaveDialogView.js 8078 2014-12-12 14:43:53Z dgorbenko $
 */

define(function (require){

    "use strict";

    var _ = require('underscore'),
        i18n = require('bundle!all'),
        ResourceModel = require('common/model/RepositoryResourceModel'),
        DialogWithModelInputValidation = require("common/component/dialog/DialogWithModelInputValidation"),
        treeFactory = require("common/component/tree/treeFactory"),
		jrsConfigs = require('jrs.configs'),

		baseSaveDialogTemplate = require('text!dataSource/saveDialog/template/baseSaveDialogTemplate.htm');

    return DialogWithModelInputValidation.extend({

		theDialogIsOpen: false,
		autoUpdateResourceID: true,
        saveDialogTemplate: baseSaveDialogTemplate,

		constructor: function(options) {
            options || (options = {});
			this.options = options;

			var model = this.extendModel(this.options.model);

            var saveButtonLabel = this._getLabelForSaveButton(model);
            var cancelButtonLabel = "resource.datasource.saveDialog.cancel";

            this.autoUpdateResourceID = !this.options.isEditMode;
            this.preSelectedFolder = options.parentFolderUri;

            DialogWithModelInputValidation.prototype.constructor.call(this, {
                skipLocation: !!options.skipLocation,
                modal: true,
                model: model,
                resizable: true,
                additionalCssClasses: "dataSourceSaveDialog",
                title: i18n["resource.datasource.saveDialog.save"],

                content: _.template(this.saveDialogTemplate, {
                    i18n: i18n,
                    model: _.extend({}, model.attributes),
                    skipLocation: !!(this.options.skipLocation),
                    isEmbedded: this.options.isEmbedded,
                    isEditMode: this.options.isEditMode
                }),
                buttons: [
                    { label: i18n[saveButtonLabel], action: "save", primary: true },
                    { label: i18n[cancelButtonLabel], action: "cancel", primary: false }
                ]
            });

            this.on('button:save', _.bind(this._onSaveDialogSaveButtonClick, this));
            this.on('button:cancel', _.bind(this._onSaveDialogCancelButtonClick, this));
        },

        initialize: function(options) {

            DialogWithModelInputValidation.prototype.initialize.apply(this, arguments);

            // check if this variables has been re-defined by inherited class
            if (_.isUndefined(this.preSelectedFolder) || !this.preSelectedFolder) {
                this.preSelectedFolder = "/";
            }
            if(!options.skipLocation){
                this.initializeTree();
            }

            this.listenTo(this.model, "change:label", this._onDataSourceNameChange);
			this.$contentContainer.find("[name=name]").change(_.bind(this._onResourceIDInputChange, this));
        },

        restoreModel: function(){
            if(this.originalModelValidation) {
                this.model.validation = this.originalModelValidation;
            }
        },

        extendModel: function (model) {
            this.originalModelValidation = model.validation;

            model.validation = _.extend({}, ResourceModel.prototype.validation, {
                label: [
                    {
                        required: true,
                        msg: i18n["resource.datasource.saveDialog.validation.not.empty.label"]
                    },
                    {
                        maxLength: ResourceModel.LABEL_MAX_LENGTH,
                        msg: i18n["resource.datasource.saveDialog.validation.too.long.label"]
                    }
                ],
                name: [
                    {
                        required: true,
                        msg: i18n["resource.datasource.saveDialog.validation.not.empty.name"]
                    },
                    {
                        maxLength: ResourceModel.NAME_MAX_LENGTH,
                        msg: i18n["resource.datasource.saveDialog.validation.too.long.name"]
                    },
                    {
                        doesNotContainSymbols: ResourceModel.NAME_NOT_SUPPORTED_SYMBOLS,
                        msg: i18n["resource.datasource.saveDialog.validation.invalid.chars.name"]
                    }
                ],
                description: [
                    {
                        required: false
                    },
                    {
                        maxLength: ResourceModel.DESCRIPTION_MAX_LENGTH,
                        msg: i18n["resource.datasource.saveDialog.validation.too.long.description"]
                    }
                ],
                parentFolderUri: [
                    {
                        fn: function(value){
                            if (!this.options.skipLocation) {
                                if (_.isNull(value) || _.isUndefined(value) || (_.isString(value) && value === '')) {
                                    return i18n["resource.datasource.saveDialog.validation.not.empty.parentFolderIsEmpty"];
                                }
                                if (value.slice(0, 1) !== '/') {
                                    return i18n["resource.datasource.saveDialog.validation.folder.not.found"].replace("{0}", value);
                                }
                            }
                        }
                    }
                ]
            });

            return model;
        },

        initializeTree: function () {

            // prepare special ID to use old tree
            var self = this, treeId = _.uniqueId("baseSaveDialogTree");
            this.$contentContainer.find(".control.groupBox .folders").attr("id", treeId);

            var saveAsTree = this.getSaveAsTree(treeId);
            saveAsTree.observe("node:selected", function (event) {
                self.model.set("parentFolderUri", event.memo.node.param.uri);
            });
            saveAsTree.showTreePrefetchNodes(this.preSelectedFolder, function() {
                saveAsTree.openAndSelectNode(self.preSelectedFolder);
            });
        },

        getSaveAsTree: function(treeId) {

            var options = this.options,
                saveAsTree,
                providerId = "repositoryExplorerTreeFoldersProvider",
                flowId = "treeFlow";

            if (jrsConfigs.isProVersion) {
                providerId = "adhocRepositoryTreeFoldersProvider";
                flowId = "adhocTreeFlow";
            }
            saveAsTree = dynamicTree.createRepositoryTree(treeId, {
                providerId: providerId,
                organizationId: options.organizationName ? options.organizationName : jrsConfigs.organizationName ? jrsConfigs.organizationName : "Organization",
                rootUri: '/',
                urlGetNode: 'flow.html?_flowId=' + flowId + '&method=getNode',
                urlGetChildren: 'flow.html?_flowId=' + flowId + '&method=getChildren',
                treeErrorHandlerFn: function () {}
            });


            var superModifyRootObject = saveAsTree.modifyRootObject;
            var setReadOnly = saveAsTree.modifyRootObject = function(rootObj, isChildrenCallback, parentNode, skipSuper){
                var children = isChildrenCallback ? rootObj : rootObj.children;
                for (var i = 0, l = children.length; i<l; i++){
                    if (!children[i].extra.isWritable) {
                        children[i].cssClass = "readonly";
                    }
                    children[i].children && setReadOnly(children[i], false, children[i], true);
                }

                if (isChildrenCallback){
                    rootObj = children;
                } else {
                    rootObj.children = children;
                }

                if (!skipSuper){
                    return superModifyRootObject.call(this, rootObj, isChildrenCallback, parentNode);
                }
            };

            return saveAsTree;
        },

		startSaveDialog: function() {

			this._openDialog();
        },

		_openDialog: function() {

			if (this.theDialogIsOpen) {
				return;
			}

			this.bindValidation();

			DialogWithModelInputValidation.prototype.open.apply(this, arguments);

			this.$contentContainer.find("[name=label]").focus();

			this.theDialogIsOpen = true;
		},

		_closeDialog: function() {

			if (!this.theDialogIsOpen) {
				return;
			}

			this.unbindValidation();
			this.clearValidationErrors();

			DialogWithModelInputValidation.prototype.close.apply(this, arguments);

			this.theDialogIsOpen = false;
		},

		_getLabelForSaveButton: function() {

			return "resource.datasource.saveDialog.save";
		},

		_onDataSourceNameChange: function() {
			if (this.autoUpdateResourceID) {
				var resourceId = ResourceModel.generateResourceName(this.model.get("label"));
				this.model.set("name", resourceId);
				this.$("input[name='name']").val(resourceId);
			}
		},

		_onResourceIDInputChange: function() {
			this.autoUpdateResourceID = false;
		},

        _onSaveDialogCancelButtonClick: function() {
            this.restoreModel();
            this._closeDialog();
        },

        _onSaveDialogSaveButtonClick: function() {
            var self = this;

			if (!this.model.isValid(true)) {
				return;
			}

			this.performSave();
        },

		performSave: function() {

			if (this.options.saveFn) {
				this.options.saveFn(this.model.attributes, this.model);
				return;
			}

			this.model.save({}, {
				success: _.bind(this._saveSuccessCallback, this),
				error: _.bind(this._saveErrorCallback, this)
			});
		},

        _saveSuccessCallback: function (model, data) {
            this._closeDialog();

            if (_.isFunction(this.options.success)) {
                this.options.success();
            }
        },

		_saveErrorCallback: function(model, xhr, options) {

			var response = false, msg;
			try { response = JSON.parse(xhr.responseText); } catch(e) {}

			// in case of opened dialog, we can highlight some fields with error
			if (this.theDialogIsOpen) {

				var view = this; // the pointer to the view

				// check if we faced Conflict issue, it's when we are trying to save DS under existing resourceID
				if (response.errorCode === "version.not.match") {
					this.fieldIsInvalid(
						view,
						"name",
						i18n["resource.dataSource.resource.exists"],
						"name"
					);
					return;
				}

				else if (response.errorCode === "mandatory.parameter.error") {

					if (response.parameters && response.parameters[0]) {

						var missedField = response.parameters[0].substr(response.parameters[0].indexOf(".") + 1);

						this.fieldIsInvalid(
							view,
							missedField,
							i18n["resource.datasource.saveDialog.parameterIsMissing"],
							"name"
						);
						return;
					}
				}

				else if (response.errorCode === "folder.not.found") {
					this.fieldIsInvalid(
						view,
						"parentFolderUri",
						i18n["ReportDataSourceValidator.error.folder.not.found"].replace("{0}", response.parameters[0]),
						"name"
					);
					return;
				}

				else if (response.errorCode === "access.denied") {
					this.fieldIsInvalid(
						view,
						"parentFolderUri",
						i18n["jsp.accessDenied.errorMsg"],
						"name"
					);
					return;
				}
			}


			// otherwise, proceed with common error handling

			msg = "Failed to save data source.";

			if (response[0] && response[0].errorCode) msg += "<br/>The reason is: " + response[0].errorCode;
			else if (response.message) msg += "<br/>The reason is: " + response.message;

			msg += "<br/><br/>The full response from the server is: " + xhr.responseText;

			dialogs.errorPopup.show(msg);


			// also, call the callback if it exists
			if (_.isFunction(this.options.error)) {
				this.options.error(model, xhr, options);
			}
        }
    });

});
