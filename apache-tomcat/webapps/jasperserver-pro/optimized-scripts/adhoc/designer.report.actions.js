define(["require","adhoc/designer","jrs.configs"],function(e){var t=e("adhoc/designer"),o=e("jrs.configs");return t.goToTopicView=function(e){var t="flow.html?_flowId=adhocFlow&_mode="+e+"&launchType="+localContext.state.launchType+"&alreadyEditing=true";o.initAdditionalUIComponents||(t+="&decorate=no"),window.isEmbeddedDesigner&&(t+="&"+jQuery.param({embeddedDesigner:!0,embeddedName:window.embeddedName,saveAsUri:window.embeddedSaveAsUri,saveAsOverwrite:window.embeddedSaveAsOverwrite})),document.location.href=t},t.cancelAdHoc=function(){return exists(localContext.isDashboard)&&localContext.isDashboard?void gotoDefaultLocation():void(usingAdhocLauncher&&""!=usingAdhocLauncher?history.back():this.redirectToTopicPage())},t.cancelTopic=function(e){e?history.back():designerBase.redirectToHomePage()},t.enableCanUndoRedo=function(){exists(toolbarButtonModule)&&(toolbarButtonModule.setButtonState($("undo"),localContext.state.canUndo),toolbarButtonModule.setButtonState($("redo"),localContext.state.canRedo),toolbarButtonModule.setButtonState($("undoAll"),localContext.state.canUndo))},t.enableRunAndSave=function(e){exists(toolbarButtonModule)&&(toolbarButtonModule.setButtonState($("save"),e),toolbarButtonModule.setButtonState($("presentation"),e),toolbarButtonModule.setButtonState($("export"),e)),canRunAndSave=e},t.canSaveAdhocReport=function(){return localContext.canSaveReport()},t.toggleDisplayManager=function(){t.isDisplayManagerVisible()?(jQuery("#"+t.DISPLAY_MANAGER_ID).addClass(layoutModule.HIDDEN_CLASS),t.setDisplayManagerVisible(!1)):(jQuery("#"+t.DISPLAY_MANAGER_ID).removeClass(layoutModule.HIDDEN_CLASS),t.setDisplayManagerVisible(!0)),jQuery("#designer").trigger("layout_update"),t.setShowDisplayManager(t.isDisplayManagerVisible())},t.isDisplayManagerVisible=function(){return localContext.state.showDisplayManager},t.setDisplayManagerVisible=function(e){localContext.state.showDisplayManager=e},t.exportReport=function(e){var o=jQuery(t.EXPORT_FORM_PATTERN);o.attr("target","_blank"),o.find('input[name="exportFormat"]').val(e),o.submit()},t.enableXtabPivot=function(e){exists(toolbarButtonModule)&&toolbarButtonModule.setButtonState($("pivot"),e)},t.enableSort=function(e){exists(toolbarButtonModule)&&toolbarButtonModule.setButtonState($("sort"),e)},t});