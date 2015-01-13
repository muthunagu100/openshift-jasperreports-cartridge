var AdHocTable={render_mode:"table",state:{},FETCH_MORE_ROWS:"fetchMoreRows",ALMOST_IN_VIEW_OFFSET:100,MINIMUM_COL_WIDTH:0,DEFAULT_GROUP_LABEL_OVERLAY_LEN:200,digitRegex:/\d+/,columnHeaderRow:null,theRows:null,theCols:null,lastRow:null,existingRowCount:null,hoverColumn:-1,reset:function(){this.groupOverlays=[],this.columnResizers={},this.columnOverlays={},this.summaryOverlays={},this.groupLabelOverlays=[],this.draggingColumnSizer=!1,this.draggingColumnOverlay=!1,this.draggingGroupOverlay=!1,this.fetchingRows=!1,this.draggingMoveOverColumnIndex=-1,this.draggingMoveOverGroupIndex=-1},setMode:function(e){this.mode=e},getMode:function(){return this.mode},init:function(){this.Rendering.infinitiveHorizontalScroll=_.bind(_.throttle(this.Rendering.infinitiveHorizontalScroll,250),this.Rendering)},initAll:function(){adhocDesigner.overlayParent=isSupportsTouch()?$("mainTableContainer").down():$("mainTableContainer"),adhocDesigner.enableXtabPivot(!1),AdHocTable.theRows=$("canvasTable").rows,AdHocTable.existingRowCount=AdHocTable.theRows.length,AdHocTable.columnHeaderRow=$("columnHeaderRow"),AdHocTable.state.endOfFile=!1,AdHocTable.shouldFetchMoreRows()&&AdHocTable.fetchMoreRows(),AdHocTable.initRowDependentDimensions(),AdHocTable.initOverlays(),AdHocTable.initKeyEvents(),jQuery("#mainTableContainer > #tableOptions").remove(),jQuery("#tableOptions").appendTo("#mainTableContainer").position({of:jQuery("#mainTableContainer .caption"),at:"left top",my:"left top",offset:"11 10"}).on("mouseover",function(e){var a=jQuery(this);a.addClass("over").css("z-index",1e5),actionModel.showDropDownMenu(e,this,this.id+AdHocTable.ACTION_MODEL_CONTEXT_SUFFIX,AdHocTable.GRID_SELECTOR_MENU_CLASS,localContext.state.actionmodel)}),jQuery("body").on("actionmodel-mouseout",function(){jQuery("#tableOptions").removeClass("over").css("z-index",9)})},Rendering:{me:!1,fullDataSet:!1,data:{containerLeftOffset:0,amountOfDisplayedCols:0,isFirstRender:0,forceShowNCols:!1},init:function(){this.data.isFirstRender=!0,this.data.containerLeftOffset=adhocDesigner.ui.canvas.scrollLeft()+adhocDesigner.ui.canvas.width()-1,this.data.amountOfDisplayedCols>0&&(this.data.forceShowNCols=this.data.amountOfDisplayedCols),this.data.amountOfDisplayedCols=0},infinitiveHorizontalScroll:function(){var e=0,a=function(){console.log.apply(console,arguments)},t=adhocDesigner.ui.canvas.scrollLeft()+adhocDesigner.ui.canvas.width();if(this.data.containerLeftOffset==t)return void(e&&a("there was no change to horizontal scroll - skipping this round...."));var o=adhocDesigner.ui.canvas.find("table tr:first"),l=o.find("th:last");if(0!=l.length){var i,s=l.position().left,n=s-t,r=0;for(e&&a("gap is: ",n);800>n;){if(this.partialRender(),i=o.find("th:last").position().left-t,i==n){e&&a("gap was not changed...");break}if(r++>10){e&&a("something bad is going on...");break}n=i;break}this.data.containerLeftOffset=t}},addMoreDataToFullState:function(e){var a=0,t=function(){console.log.apply(console,arguments)},o=this;a&&t("data to add to full dataset: ",e);var l,i;for(i=e.table.flattenedData,l=0;l<i.length;l++)this.fullDataSet.table.flattenedData.push(i[l]);_.each(["endOfFile","hitMaxRows","inDesignView","isShowingFullData"],function(a){o.fullDataSet[a]=e[a]}),a&&t("compiled full dataset: ",this.fullDataSet)},getPartialDataFromFullState:function(e,a,t){var o=0,l=function(){console.log.apply(console,arguments)};o&&l("getPartialDataFromFullState: SOURCE: ",e),t=t||0;var i,s,n=a+t,r={columns:[],table:{hasColumns:e.table.hasColumns,hasSummaryRow:e.table.hasSummaryRow,showTableTotals:e.table.showTableTotals,showTableDetails:e.table.showTableDetails,columns:[],columnHeaderRow:{members:[]},summaryRow:{members:[]},flattenedData:[]}};for(o&&l("data getter: reading from: ",a," up to ",n),s=e.columns,i=a;n>i&&i<s.length;i++)r.columns.push(s[i]);for(s=e.table.columns,i=a;n>i&&i<s.length;i++)r.table.columns.push(s[i]);for(s=e.table.columnHeaderRow.members,i=a;n>i&&i<s.length;i++)r.table.columnHeaderRow.members.push(s[i]);if(e.table.summaryRow)for(s=e.table.summaryRow.members,i=a;n>i&&i<s.length;i++)r.table.summaryRow.members.push(s[i]);return _.each(e.table.flattenedData,function(e){var a={id:e.id,isRow:e.isRow,isFooter:e.isFooter,isGroupMember:e.isGroupMember,rowClass:e.rowClass,formattedValue:e.formattedValue,members:[]};e.groupSummaryRow&&(a.groupSummaryRow={members:[]}),e.group&&(a.group={mask:e.group&&e.group.mask||void 0,numericType:e.group&&e.group.numericType||void 0,defaultDisplayName:e.group&&e.group.defaultDisplayName||void 0,currentDisplayName:e.group&&e.group.currentDisplayName||void 0,name:e.group&&e.group.name||void 0}),r.table.flattenedData.push(a)}),_.each(e.table.flattenedData,function(e,t){for(e=e.members,i=a;n>i&&i<e.length;i++)r.table.flattenedData[t].members.push(e[i])}),_.each(e.table.flattenedData,function(e,t){if(e.groupSummaryRow)for(e=e.groupSummaryRow.members,i=a;n>i&&i<e.length;i++)r.table.flattenedData[t].groupSummaryRow.members.push(e[i])}),o&&l("RESULT: ",r),r},partialRender:function(){var e=0,a=function(){console.log.apply(console,arguments)},t=100;this.data.forceShowNCols&&(t=this.data.forceShowNCols,this.data.forceShowNCols=!1);var o=this.getPartialDataFromFullState(this.fullDataSet,this.data.amountOfDisplayedCols,t),l={columns:this.fullDataSet.columns,groups:this.fullDataSet.groups,partial:o,hasNoData:this.fullDataSet.hasNoData,endOfFile:this.fullDataSet.endOfFile,title:this.fullDataSet.title,titleBarShowing:this.fullDataSet.titleBarShowing};e&&a("dataForRender: ",l);var i=this.me.tableTemplate(l);isIE9()&&(i=removeWhitespacesFromTable(i));var s=!(0===l.partial.columns.length&&0===l.groups.length);if(this.data.isFirstRender)return e&&a("doing full display: ",t," records to display"),adhocDesigner.ui.canvas.html(i),this.data.isFirstRender=!1,this.data.amountOfDisplayedCols=t,s;e&&a("doing partial display: ",t," records to display");var n=jQuery(i),r=adhocDesigner.ui.canvas.find("table tr"),d=n.find("tr"),u=0;return _.each(r,function(e,a){if(d[a])for(var t=0,o=d[a].childNodes.length;o>t;t++)child=d[a].childNodes[0],child.parentNode.removeChild(child),child.hasAttribute&&child.hasAttribute("colspan")||"#text"!=child.nodeName.toLowerCase()&&(r[a].appendChild(child),0==a&&u++)}),e&&a("Added: ",u," columns"),this.data.amountOfDisplayedCols+=u,s},addMoreRows:function(e){var a=0,t=function(){console.log.apply(console,arguments)};adhocDesigner.registerTemplate(this.me,"tableRowsTemplate","tableRowsTemplate"),this.addMoreDataToFullState(e),a&&t("add more rows: moreRowsState: ",e);var o=this.getPartialDataFromFullState(e,0,this.data.amountOfDisplayedCols);a&&t("add more rows: partialData: ",o);var l={columns:this.fullDataSet.columns,groups:this.fullDataSet.groups,partial:o,hasNoData:this.fullDataSet.hasNoData,endOfFile:this.fullDataSet.endOfFile,title:this.fullDataSet.title,titleBarShowing:this.fullDataSet.titleBarShowing};a&&t("add more rows: dataForRender: ",l);var i=this.me.tableRowsTemplate(l).replace(/^[\s]*<tbody id="tableDetails" class="copyTo">/g,"").replace(/<\/tbody>[\s]*/g,"");isIE9()&&(i=removeWhitespacesFromTable(i)),jQuery("#canvasTable > tbody.copyTo").append(i),this.me.initNewRows()}},render:function(){this.Rendering.me=this,this.Rendering.init(),this.Rendering.fullDataSet=this.state;var e=this.Rendering.partialRender();this.Rendering.infinitiveHorizontalScroll();var a=jQuery("#titleCaption").children().eq(0),t=a.width(),o=jQuery("#titleCaption").width();return o>t&&a.width(o),adhocDesigner.setNothingToDisplayVisibility(!e||this.state.isShowingNoData),adhocDesigner.ui.canvas.unbind("scroll",this.Rendering.infinitiveHorizontalScroll).bind("scroll",this.Rendering.infinitiveHorizontalScroll),this.state.isShowingNoData?(jQuery("#nothingToDisplayMessage").html(adhocDesigner.getMessage("noDataMode")),jQuery("#columnHeaderRow").hide(),jQuery("#canvasTable").css("border","none")):(jQuery("#nothingToDisplayMessage").html(this.nothingToDisplayMessage),jQuery("#columnHeaderRow").show(),jQuery("#canvasTable").css("border-width","1px"),jQuery("#canvasTable").css("border-style","solid")),e||(jQuery("#columnHeaderRow").hide(),jQuery("#canvasTable").css("border","none")),e}};AdHocTable._getTableHeaders=function(){return $$("tr#columnHeaderRow.labels.column th.label")},AdHocTable.canSaveReport=function(){return $("canvasTableCols")&&(AdHocTable.theCols=$("canvasTableCols").getElementsByTagName("col"),AdHocTable.theCols)?AdHocTable.theCols.length>0:!1},AdHocTable.deselectAllSelectedOverlays=function(){AdHocTable.deselectAllTableColumns(),AdHocTable.deselectAllSummaryCells(),AdHocTable.deselectAllColumnGroupRows()},AdHocTable.removeFromSelectObjects=function(e){var a;selObjects.each(function(t){t.index==e&&(a=t)}),selObjects=selObjects.without(a)};