define(["require","adhoc/designer"],function(e){var t=e("adhoc/designer");return t.addSelectedObject=function(e,t,n,s){n?s?this.removeSelectedObject(t):designerBase.addToSelected(t):(designerBase.unSelectAll(),designerBase.addToSelected(t))},t.selectSingleObject=function(e){designerBase.unSelectAll(),designerBase.addToSelected(e)},t.deselectSelectedObject=function(e){this.removeSelectedObject(e)},t.removeSelectedObject=function(e){designerBase.unSelectGiven(e)},t.unSelectAvailableTreeNodes=function(){this.measuresTree&&this.measuresTree._deselectAllNodes(),this.dimensionsTree&&this.dimensionsTree._deselectAllNodes()},t.getNameForSelectedTreeNode=function(){var e=designerBase.getSelectedObject();return e?e.param.id:""},t.getSelectedTreeNodes=function(){return t.dimensionsTree.selectedNodes.length>0?t.dimensionsTree.selectedNodes:t.measuresTree.selectedNodes},t.isSelectedNode=function(e){if(!e||!e.getTreeId)return null;var t=dynamicTree.trees[e.getTreeId()];return t.isNodeSelected(e)},t.isSelectedTreeNodeAFolder=function(){var e=designerBase.getSelectedObject();return e?e.hasChilds():!0},t.isAlreadySelected=function(e){return designerBase.isInSelection(e)},t.isMultiSelect=function(e,t){var n=isMetaHeld(e),s=isShiftHeld(e),r=selectionCategory.area==t;return selectionCategory.area==designerBase.AVAILABLE_FIELDS_AREA?r&&(n||s):r&&n},t.hasSpacerInSelection=function(){for(var e=0;e<selObjects.length;e++)if(t.getNameForSelected(selObjects[e])===designerBase.SPACER_NAME)return!0;return!1},t.isSpacerSelected=function(e){return e=e||selObjects[0],t.getNameForSelected(e)===designerBase.SPACER_NAME},t.isConstantSelected=function(e){return t.getNameForSelected(e).startsWith(e?constantFieldsLevel+".":constantFieldsLevel+".")},t.isMeasureSelected=function(e){return e&&e.menuLevel?e.menuLevel.startsWith(this.OLAP_MEASURES_TREE):!1},t.isUsedAsGroup=function(e){var t=localContext.state.groups;if(null!=t)for(var n=0;n<t.length;n++)if(t[n].name==e)return!0;return!1},t.hasGroupInSelection=function(){for(var e=0;e<selObjects.length;e++)if(t.isUsedAsGroup(t.getNameForSelected(selObjects[e])))return!0;return!1},t});