define(["require","underscore","./../../base/componentViewTrait/reportTrait","dashboard/view/designer/AdhocDesignerIframeView","dashboard/mapper/adHocToDashboardTypeMapper","../../../collection/ReportsParametersCollection","../../../enum/dashboardComponentTypes","bundle!DashboardBundle"],function(e){var o=e("underscore"),n=e("./../../base/componentViewTrait/reportTrait"),t=e("dashboard/view/designer/AdhocDesignerIframeView"),r=e("dashboard/mapper/adHocToDashboardTypeMapper"),i=e("../../../collection/ReportsParametersCollection").instance,a=e("../../../enum/dashboardComponentTypes"),d=e("bundle!DashboardBundle");return o.extend({},n,{additionalContextMenuOptions:[{label:d["dashboard.context.menu.option.edit"],action:"edit"}],_initComponentSpecificContextMenuEvents:function(){this.listenTo(this.contextMenu,"option:edit",this._editComponent)},_reInitDashlet:function(){this._removeComponent(),this.model.resetCaching(),this._initComponent()},_editComponent:function(){function e(){n.stopListening(d),d.remove()}var n=this,d=new t({model:this.model});n.listenTo(d,"close",function(){e()}),n.listenTo(d,"save",function(t,d){e(),n.model.changeType(r(d.type)),n._reInitDashlet(),n.listenTo(i,"change",function(e){n.model.resource.resource.get("uri")===e.id&&(n.stopListening(i,"change"),this.paramsModel.paramsChanged||n.refresh(),o.invoke(n.model.collection.where({type:a.FILTER_GROUP}),"notify",!0))}),i.getReportParameters(n.model.resource.resource.get("uri"),{force:!0}).done(function(e){var t=o.pluck(n.model.get("parameters"),"id"),r=o.pluck(e,"id"),i=o.difference(t,r),d=n.model.collection.where({type:a.INPUT_CONTROL,ownerResourceId:n.model.resource.id});n.model.collection.remove(o.reduce(d,function(e,n){return o.indexOf(i,n.getOwnerParameterName())>=0&&e.push(n),e},[])),n.model.set("parameters",o.map(e,function(e){return{id:e.id,uri:e.uri,label:e.label}}))}),n.model.trigger("edit",n.model)}),d.render()}})});