define(["require","./BaseComponentModel","../enum/jiveTypes","../enum/interactiveComponentTypes","underscore","../../enum/reportEvents"],function(t){function e(t,n){var r,o={},s=0;if(!n.length||n[0].columnValues&&n[0].columnValues.length>t){for(var u=0,a=n.length;a>u;u++)r=o[n[u].columnValues[t].value]||(o[n[u].columnValues[t].value]=[]),r.push(n[u]);for(var i in o){r=o[i];for(var u=0,a=r.length;a>u;u++)r[u].id+="/"+s;e(t+1,o[i]),s++}}return n}function n(t){for(var e=0,n=t.length;n>e;e++)t[e].groupIndex=e,t[e].id+="/"+e;return t}var r=t("./BaseComponentModel"),o=t("../enum/jiveTypes"),s=t("../enum/interactiveComponentTypes"),u=t("underscore"),a=t("../../enum/reportEvents");return r.extend({defaults:function(){return{type:o.CROSSTAB,module:"jive.crosstab",uimodule:"jive.crosstab.interactive",id:void 0,fragmentId:void 0,startColumnIndex:0,rowGroups:[],dataColumns:[]}},actions:{"change:order":function(t){var e=null;return"asc"===t.sort.order&&(e="ASCENDING"),"desc"===t.sort.order&&(e="DESCENDING"),t.componentType===s.CROSSTAB_COLUMN?{actionName:"sortXTabByColumn",sortData:{crosstabId:this.attributes.id,order:e,measureIndex:t.sortMeasureIndex,columnValues:t.columnValues}}:{actionName:"sortXTabRowGroup",sortData:{crosstabId:this.attributes.id,order:e||"NONE",groupIndex:t.groupIndex}}}},initialize:function(t){this.config={},u.extend(this.config,t),this.events={ACTION_PERFORMED:"action",BEFORE_ACTION_PERFORMED:"beforeAction"}},getId:function(){return this.config.id},getFragmentId:function(){return this.config.fragmentId},sortRowGroup:function(t,e){var n=this,r={action:{actionName:"sortXTabRowGroup",sortData:{crosstabId:this.getId(),order:e,groupIndex:t}}};n._notify({name:n.events.BEFORE_ACTION_PERFORMED}),n.trigger(a.ACTION,r.action)},isDataColumnSortable:function(t){var e=this.config.dataColumns[t-this.config.startColumnIndex];return"number"==typeof e.sortMeasureIndex},getColumnOrder:function(t){return this.config.dataColumns[t-this.config.startColumnIndex].order},sortByDataColumn:function(t,e){var n=this,r=this.config.dataColumns[t-this.config.startColumnIndex],o={action:{actionName:"sortXTabByColumn",sortData:{crosstabId:this.getId(),order:e,measureIndex:r.sortMeasureIndex,columnValues:r.columnValues}}};n._notify({name:n.events.BEFORE_ACTION_PERFORMED}),n.trigger(a.ACTION,o.action)},updateFromReportComponentObject:function(t){var e={};"order"in t.sort?e.order=t.sort.order:0===u.keys(t.sort).length&&(e.order=null),this.set(e,t)},toReportComponentObject:function(){return this.getDataColumns(this.attributes.dataColumns).concat(this.getRowGroups(this.attributes.rowGroups))},getDataColumns:function(){var t=function(t){var e={id:this.getId()+"/dataColumns",componentType:s.CROSSTAB_COLUMN};return u.map(t,function(t){return u.extend({},e,t)})},n=u.bind(e,this,0),r=function(t){return u.filter(t,function(t){return"number"==typeof t.sortMeasureIndex})},o=function(t){return u.each(t,function(t){t.sort={},"ASCENDING"===t.order&&(t.sort.order="asc"),"DESCENDING"===t.order&&(t.sort.order="desc"),delete t.order}),t};return u.compose(o,r,n,t)}(),getRowGroups:function(){var t=function(t){var e={id:this.getId()+"/rowGroups",componentType:s.CROSSTAB_ROW};return u.map(t,function(t){return u.extend({},e,t)})},e=n,r=function(t){return u.filter(t,function(t){return t.sortable})},o=function(t){return u.each(t,function(t){t.sort={},"ASCENDING"===t.order&&(t.sort.order="asc"),"DESCENDING"===t.order&&(t.sort.order="desc"),delete t.order,delete t.sortable}),t};return u.compose(o,r,e,t)}()})});