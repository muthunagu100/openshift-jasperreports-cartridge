var keyManager={ignoreKeyDown:[Keys.DOM_VK_SHIFT,Keys.DOM_VK_CONTROL,Keys.DOM_VK_ALT],noBubbleOnKeyUp:[Keys.DOM_VK_F10]};document.observe("keyup",function(e){keyManager.noBubbleOnKeyUp.include(e.keyCode)&&Event.stop(e)}),document.observe("keydown",function(e){if(!keyManager.ignoreKeyDown.include(e.keyCode)){var o=e.element();return e.keyCode==Event.KEY_RETURN?void o.fire("key:enter",{targetEvent:e,node:o}):e.shiftKey&&e.keyCode==Keys.DOM_VK_F10?(Event.stop(e),void o.fire("key:contextMenu",{targetEvent:e,node:o})):e.keyCode==Event.KEY_LEFT?void o.fire("key:left",{targetEvent:e,node:o}):e.keyCode==Event.KEY_RIGHT?void o.fire("key:right",{targetEvent:e,node:o}):e.keyCode==Event.KEY_UP?void o.fire("key:up",{targetEvent:e,node:o}):e.keyCode==Event.KEY_DOWN?void o.fire("key:down",{targetEvent:e,node:o}):isMetaHeld(e)&&89==e.keyCode?void o.fire("key:redo",{targetEvent:e,node:o}):isMetaHeld(e)&&90==e.keyCode?void o.fire("key:undo",{targetEvent:e,node:o}):e.keyCode==Event.KEY_ESC?void o.fire("key:escape",{targetEvent:e,node:o}):e.keyCode==Event.KEY_TAB?void o.fire("key:tab",{targetEvent:e,node:o}):e.keyCode==Event.KEY_DELETE?void o.fire("key:delete",{targetEvent:e,node:o}):65==e.keyCode&&isMetaHeld(e)?void o.fire("key:selectAll",{targetEvent:e,node:o}):83==e.keyCode&&isMetaHeld(e)&&!isShiftHeld(e)?void o.fire("key:save",{targetEvent:e,node:o}):76==e.keyCode&&isMetaHeld(e)&&isShiftHeld(e)?void o.fire("key:chartZoomIn",{targetEvent:e,node:o}):79==e.keyCode&&isMetaHeld(e)&&isShiftHeld(e)?void o.fire("key:chartZoomOut",{targetEvent:e,node:o}):void 0}}),document.observe("key:esc",function(){actionModel.isMenuShowing()&&actionModel.hideActionModelMenu()}),document.observe("key:enter",function(e){var o,t=e.element(),n=$(layoutModule.MENU_ID);if(layoutModule.isVisible(n)){Event.stop(e);var u=n.select("."+layoutModule.HOVERED_CLASS)[0];if(u){var a=u.up(layoutModule.MENU_LIST_PATTERN);setTimeout(a.onmouseup.curry(e.memo.targetEvent),0)}}o=matchMeOrUp(t,layoutModule.NAVIGATION_PATTERN),o&&(o.identify()==layoutModule.MAIN_NAVIGATION_HOME_ITEM_ID?(Event.stop(e),primaryNavModule.navigationOption("home")):o.identify()==layoutModule.MAIN_NAVIGATION_LIBRARY_ITEM_ID&&(Event.stop(e),primaryNavModule.navigationOption("library")))}),document.observe("key:down",function(e){{var o;e.element()}if(layoutModule.isVisible(layoutModule.MENU_ID)){Event.stop(e);var t=$(layoutModule.MENU_ID).select("."+layoutModule.HOVERED_CLASS)[0];if(t){var n=t.up(layoutModule.MENU_LIST_PATTERN),u=getNextNonMatchingSibling(n,layoutModule.SEPARATOR_PATTERN);return void(u&&(buttonManager.out(t),buttonManager.over(u.down(layoutModule.BUTTON_PATTERN)),u.focus()))}}(o=matchAny(e.element(),[layoutModule.NAVIGATION_MUTTON_PATTERN],!0))&&(buttonManager.out(o.down(layoutModule.BUTTON_PATTERN)),buttonManager.over(actionModel.getFirstMenuButton()),actionModel.focusMenu())}),document.observe("key:up",function(e){e.element();if(layoutModule.isVisible(layoutModule.MENU_ID)){Event.stop(e);var o=$(layoutModule.MENU_ID).select("."+layoutModule.HOVERED_CLASS)[0];if(o){var t=o.up(layoutModule.MENU_LIST_PATTERN),n=getPreviousNonMatchingSibling(t,layoutModule.SEPARATOR_PATTERN)||actionModel.getMenuParent();n&&(buttonManager.out(o),buttonManager.over(n.down(layoutModule.BUTTON_PATTERN)),n.focus())}}}),document.observe("key:left",function(e){var o,t=(e.element(),$(layoutModule.MAIN_NAVIGATION_ID)),n=t&&t.select("."+layoutModule.HOVERED_CLASS)[0];if(n){Event.stop(e);var u=n.up(layoutModule.NAVIGATION_PATTERN),a=getPreviousMatchingSibling(u,layoutModule.NAVIGATION_PATTERN);a&&(actionModel.hideMenu(),buttonManager.out(n),buttonManager.over(a.down(layoutModule.BUTTON_PATTERN)),a.focus(),o=matchMeOrUp(a,layoutModule.NAVIGATION_MUTTON_PATTERN),o&&primaryNavModule.showNavButtonMenu(e,o))}}),document.observe("key:right",function(e){var o,t=(e.element(),$(layoutModule.MAIN_NAVIGATION_ID)),n=t&&t.select("."+layoutModule.HOVERED_CLASS)[0];if(n){Event.stop(e);var u=n.up(layoutModule.NAVIGATION_PATTERN),a=getNextMatchingSibling(u,layoutModule.NAVIGATION_PATTERN);a&&(actionModel.hideMenu(),buttonManager.out(n),buttonManager.over(a.down(layoutModule.BUTTON_PATTERN)),a.focus(),o=matchMeOrUp(a,layoutModule.NAVIGATION_MUTTON_PATTERN),o&&primaryNavModule.showNavButtonMenu(e,o))}});