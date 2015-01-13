define(["require","bundle!jasperserver_messages","bundle!adhoc_messages","adhoc/calculatedFields/CalculatedFieldsController","adhoc/calculatedFields/CalculatedFieldsService"],function(e){var a,t=_.extend(e("bundle!jasperserver_messages"),e("bundle!adhoc_messages")),l=e("adhoc/calculatedFields/CalculatedFieldsController"),o=e("adhoc/calculatedFields/CalculatedFieldsService");return window.adhocCalculatedFields={DIALOG_ID:"calcFieldMeasure",FIELDS_CONTAINER_ID:"#calculatedFields-container",calcFieldsService:new o({clientKey:clientKey}),showDialog:function(e){a=$(this.DIALOG_ID),a.down("button.doneButton").observe("click",e.applyField.bind(e)),a.down("button.cancelButton").observe("click",function(){e.stop(),this.closeDialog()}.bind(this)),dialogs.popup.show(a),a.style.marginTop="0",a.style.top="15px"},closeDialog:function(){Event.stopObserving(a.down("button.doneButton")),Event.stopObserving(a.down("button.cancelButton")),dialogs.popup.hide(a)},setDialogLabels:function(e,l){var o=e?{dialogHeader:l?"ADH_401_DIALOG_HEADER_EDIT_CUSTOM_MEASURE":"ADH_401_DIALOG_HEADER_NEW_CUSTOM_MEASURE",okButtonLabel:l?"button.save":"ADH_430_BUTTON_CREATE_MEASURE"}:{dialogHeader:l?"ADH_401_DIALOG_HEADER_EDIT_CUSTOM_FIELD":"ADH_401_DIALOG_HEADER_NEW_CUSTOM_FIELD",okButtonLabel:l?"button.save":"ADH_430_BUTTON_CREATE_FIELD"};$(a.down(".header.mover > .title")).update(t[o.dialogHeader]),$(a.down(".footer button.doneButton span.wrap")).update(t[o.okButtonLabel])},createField:function(e){var a=new l({element:this.FIELDS_CONTAINER_ID,service:this.calcFieldsService});a.listenTo(a,"field:loaded",this.setDialogLabels.bind(this)),a.listenTo(a,"field:applied",function(e){a.stop(),this.closeDialog(),this.createCustomFieldCallback(e)}.bind(this)),this.showDialog(a),a.start({editingMode:!1,kind:e})},updateField:function(){var e=designerBase.getSelectedObject(),a=e.model?e.model.fieldName:adhocDesigner.getNameForSelected(e);if(null==a)throw'The field "'+a+'" is not found.';var t=new l({element:this.FIELDS_CONTAINER_ID,service:this.calcFieldsService});t.listenTo(t,"field:loaded",this.setDialogLabels.bind(this)),t.listenTo(t,"field:applied",function(e){t.stop(),this.closeDialog(),this.updateCustomFieldCallback(e)}.bind(this)),this.showDialog(t),t.start({editingMode:!0,selectedFieldName:a})},deleteField:function(){var e=designerBase.getSelectedObject(),a=adhocDesigner.getNameForSelected(e);if(adhocDesigner.isInUse(a))throw"The field in use.";var t=function(t){this.deleteCustomFieldCallback(a,e,t),adhocDesigner.enableCanUndoRedo()}.bind(adhocCalculatedFields);this.calcFieldsService.remove(a).done(_.bind(function(e,a,l){if(204===l.status)throw"Field not found.";adhocCalculatedFields._updateState(t)},this))},createCustomFieldCallback:function(e){var a="MEASURE"===e.kind;dialogs.systemConfirm.show(t[a?"ADH_435_CALCULATED_MEASURE_ADDED":"ADH_435_CALCULATED_FIELD_ADDED"],5e3),adhocCalculatedFields._updateState(function(t){var l=localContext.state.allColumns.length;if(adhocCalculatedFields._updateLocalContextFromState(t),adhocDesigner.enableCanUndoRedo(),localContext.state.allColumns.length>l){var o=e.name,d=adhocDesigner.getFieldIndexByName(o),i=adhocDesigner.findFieldByName(o).type,n={id:o,label:e.display,type:"com.jaspersoft.jasperserver.api.metadata.common.domain.NewNode",uri:"/"+o,cssClass:"calculatedField",order:d,extra:{id:o,name:o,isMeasure:a,dimensionId:a?adhocDesigner.MEASURES:o,dataType:i}},s=a?adhocDesigner.measuresTree:adhocDesigner.dimensionsTree;adhocDesigner.addNodeToTree(n,s),adhocDesigner.updateAllFieldLabels()}})},updateCustomFieldCallback:function(e){var a="MEASURE"===e.kind;dialogs.systemConfirm.show(t[a?"ADH_435_CALCULATED_MEASURE_UPDATED":"ADH_435_CALCULATED_FIELD_UPDATED"],5e3),adhocCalculatedFields._updateState(function(a){adhocCalculatedFields._updateLocalContextFromState(a),adhocDesigner.enableCanUndoRedo(),adhocDesigner.isInUse(e.name)&&(localContext.updateViewCallback(a),adhocDesigner.filtersController.setFilters(a,{reset:!0})),adhocDesigner.updateAllFieldLabels()})},deleteCustomFieldCallback:function(e,a,l){var o=a.param.extra.isMeasure;dialogs.systemConfirm.show(t[o?"ADH_435_CALCULATED_MEASURE_DELETED":"ADH_435_CALCULATED_FIELD_DELETED"],5e3);var d=localContext.state.allColumns.length;this._updateLocalContextFromState(l),adhocDesigner.enableCanUndoRedo(),localContext.state.allColumns.length<d&&a&&(adhocDesigner.removeNodeFromTree(a),adhocDesigner.updateAllFieldLabels())},_updateState:function(e){designerBase.sendRequest(adhocDesigner.getControllerPrefix()+"_loadState",[],function(a){e(a)})},_updateLocalContextFromState:function(e){localContext.state.allColumns=e.allColumns,localContext.state.canRedo=e.canRedo,localContext.state.canUndo=e.canUndo}},window.adhocCalculatedFields});