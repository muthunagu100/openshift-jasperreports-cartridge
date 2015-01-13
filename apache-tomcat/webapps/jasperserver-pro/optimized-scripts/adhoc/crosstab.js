var AdHocCrosstab={DRILL_THROUGH_PATTERN:"tbody#detailRows tr td.value span",ROW_GROUP_MEMBER_PATTERN:"tbody#detailRows tr td.member",COLUMN_GROUP_MEMBER_PATTERN:"thead#headerAxis th.member",GROUP_LEVEL_PATTERN:"thead#headerAxis tr th.level",MEASURE_PATTERN:"table#canvasTable .measure",GROUP_MEMBER_DISCLOSURE_PATTERN:".olap span.button.disclosure",GROUP_LEVEL_DISCLOSURE_PATTERN:"th.level span.button.disclosure",SORT_ICON_PATTERN:".olap .icon.sort",MEASURE_LABEL_PATTERN:"#measureLabel.label.measure UL.measures LI.leaf a span.xm",XTAB_LABEL_PATTERN:"th.label.group",ROW_GROUP_OVERFLOW_PATTERN:"td.rowOverflow",COLGROUP_GROUP_OVERFLOW_PATTERN:"th.colOverflow",COLGROUP_PLACEHOLDER:"th#columnGroupsPlaceHolder",ROW_GROUP_PLACEHOLDER:"td#rowGroupsPlaceHolder",MEASURES_PLACEHOLDER:"td#measuresPlaceHolder",TREE_CONTEXT_MENU_PATTERN:["ul#dimensionsTree li.leaf .button","ul#dimensionsTree li.node .button","ul#measuresTree li.leaf .button","ul#measuresTree li.node .button"],SHOWING_DISPLAY_MANAGER_CLASS:"showingDisplayManager",OLAP_COLUMNS_ID:"olap_columns",OLAP_ROWS_ID:"olap_rows",DM_AXIS_LIST_PATTERN:"ul.tokens.sortable",NULL_DIMENSION:"NULL Dimension",DIMENSION_TREE_DIMENSION_CONTEXT:"dimensionsTree_dimension",DIMENSION_TREE_LEVEL_CONTEXT:"dimensionsTree_level",MEASURE_TREE_GROUP_CONTEXT:"measuresTree_group",MEASURE_TREE_CONTEXT:"measuresTree",DISPLAY_MANAGER_ROW_CONTEXT:"displayManagerRow",DISPLAY_MANAGER_COLUMN_CONTEXT:"displayManagerColumn",MEASURES_DIMENSION_ROW_MENU_CONTEXT:"measuresDimensionInRows",MEASURES_DIMENSION_COLUMN_MENU_CONTEXT:"measuresDimensionInColumns",MEASURE_ROW_MENU_CONTEXT:"measureRow",MEASURE_COLUMN_MENU_CONTEXT:"measureColumn",ENDS_WITH_A_NUMBER_REGEX:new RegExp("\\d+$"),ALL_LEVEL_NAME:"(All)",MEASURE:"measure",ROW_GROUP_MEMBER:"rgMember",COLUMN_GROUP_MEMBER:"cgMember",ROW_GROUP_PREFIX:"rowGroup",HACK_PADDING:1,VISUAL_CUE_HACK_PADDING:2,TRUNCATED_LABEL_LEN:100,requestsInProgress:0,DROP_TARGET_CLASS:"dropTarget",draggingMoveOverIndex:-1,currentlyDraggingIndex:-1,getMode:function(){return this.mode},setMode:function(e){this.mode=e},reset:function(){},render:function(){var e=this.state,t=e.crosstab,n="OK"===t.queryStatus,s=this[this.getMode()+"Template"](e);return isIE9()&&(s=removeWhitespacesFromTable(s)),adhocDesigner.ui.canvas.html(s),adhocDesigner.setNothingToDisplayVisibility(!n||e.isShowingNoData),adhocDesigner.enableXtabPivot(this.isPivotAllowed()),this.state.isShowingNoData?(jQuery("#nothingToDisplayMessage").html(adhocDesigner.getMessage("noDataMode")),jQuery("#canvasTable").css("border","none")):(jQuery("#nothingToDisplayMessage").html(adhocDesigner.getMessage(t.queryStatusMessagePrefix+t.queryStatus)),jQuery("#canvasTable").css("border-width","1px"),jQuery("#canvasTable").css("border-style","solid")),n},isPivotAllowed:function(){return this.state.getDimensionsCount("row")>0||(localContext.isNonOlapMode()?this.state.getDimensionsCount("column")>0:!1)},initAll:function(){new Truncator($$(AdHocCrosstab.MEASURE_LABEL_PATTERN),AdHocCrosstab.TRUNCATED_LABEL_LEN),new Truncator($$(AdHocCrosstab.XTAB_LABEL_PATTERN),AdHocCrosstab.TRUNCATED_LABEL_LEN)},isOlapMode:function(){return this.getMode()===designerBase.OLAP_CROSSTAB},isNonOlapMode:function(){return this.getMode()===designerBase.CROSSTAB},fromSiblingHierarchy:function(e,t,n){if(!e)return!1;var s=this.state.getLevelsFromDimension(t,n);return s.length>0&&-1===s[0].indexOf("["+e+"]")}};AdHocCrosstab.State={getDimensions:function(e){return e?this.crosstabState[e+"Groups"]:_.chain(this.crosstabState).filter(function(e,t){return t.search(/Groups$/)>=0}).flatten().value()},getDimension:function(e,t){return _.find(this.getDimensions(t),function(t){return t.name===e})},getDimensionsCount:function(e){return this.getDimensions(e).length},getLevelsFromDimension:function(e,t){return _.pluck(this.getLevelObjectsFromDimension(e,t),"name")},getLevelObjectsFromDimension:function(e,t){var n=this.getDimensions(t);return e=_.find(n,function(t){return t.name===e}),e?_.chain(e.levels).filter(function(e){return e.visible}).map(function(e){return _.isEmpty(e.members)?e:e.members}).flatten().filter(function(e){return!e.isSpacer}).value():[]},getLevelObject:function(e,t,n){function s(e,t){return _.find(e,function(e){return e.name==t})}var r=this.getDimensions(n),i=s(r,t);return i?s(i.levels,e):null},getFilteredList:function(e,t){var n=e||null,s=t||{};return 1===arguments.length&&_.isObject(e)&&(s=e,n=null),s.visible=!0,_.chain(this.getDimensions(n)).pluck("levels").flatten().map(function(e){return _.isEmpty(e.members)?e:e.members}).flatten().filter(function(e){return _.all(s,function(t,n){return void 0===e[n]||e[n]===t})}).value()},getFilteredMeasureList:function(e,t){var n=e||null,s=t||{};return 1===arguments.length&&_.isObject(e)&&(s=e,n=null),this.getFilteredList(n,_.extend(s,{measure:!0,measuresLevel:!0}))}};