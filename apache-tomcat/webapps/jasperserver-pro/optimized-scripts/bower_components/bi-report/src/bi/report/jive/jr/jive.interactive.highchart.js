define(["jquery.ui","text!jr.jive.chartSelector.tmpl","csslink!jr.jive.highcharts.vm.css","bundle!CommonBundle"],function(e,t,r,c){var n=function(){var r=this;r.handleServerError=function(n){if(r.errorDialog||(r.errorDialog=e(t).find(".jive_chartTypeSelector").css({"z-index":500,width:400,"min-height":150}),r.errorDialog.appendTo("body").draggable().on("click touchend",".closeIcon",function(){r.errorDialog.hide()})),r.errorDialog.find(".body").html("<span>"+n.devmsg+"</span>"),r.errorDialog.find(".title").html(c["dialog.exception.title"]),r.currentChart){var o=e("#"+r.currentChart.get("hcinstancedata").renderto)[0];r.errorDialog.show().position({of:o||"body",at:"center center",my:"center center"}),r.chartTypeSelector.find("div.cell").removeClass("selected"),r.chartTypeSelector.find('div.cell[data-hcname="'+r.currentChart.config.charttype+'"]').addClass("selected")}},r.init=function(c){var n=r.currentChart&&r.currentChart.config.id;r.currentChart=null,r.chartIcon=e(t).find(".show_chartTypeSelector_wrapper"),e.each(c.components.chart,function(){var t=this;if(t.config.interactive){n==t.config.id&&(r.currentChart=t);var o=r.chartIcon.clone().insertBefore("#"+t.config.hcinstancedata.renderto);o.find(".jive_chartMenu").on("click touchend","li.jive_chartTypeMenuEntry",function(){r.currentChart=t,!r.chartTypeSelector&&r.createChartTypeSelector();var n=e("#"+r.currentChart.get("hcinstancedata").renderto)[0];return r.chartTypeSelector.attr("data-reportId",c.id).show().position({of:n||"body",at:"center top",my:"center top",collision:"none fit"}),r.renderChartTypeSelector(t.config.charttype,t),!1})}}),e(".jive_chartSettingsIcon").on("mouseenter",function(){var t=e(this);t.addClass("over"),t.next(".jive_chartMenu").show().position({top:t.height(),left:0})}),e(".jive_chartMenu").on("mouseleave touchend",function(){var t=e(this);t.prev(".jive_chartSettingsIcon").removeClass("over"),t.hide()}),e(".jive_chartMenu").on("mouseenter touchstart","p.wrap",function(){e(this).addClass("over")}),e(".jive_chartMenu").on("mouseleave touchend","p.wrap",function(){e(this).removeClass("over")})},r.createChartTypeSelector=function(){r.chartTypeSelector=e(t).find(".jive_chartTypeSelector"),r.chartTypeSelector.appendTo("body").hide(),r.chartTypeSelector.draggable(),r.chartTypeSelector.on("click touchend",".closeIcon",function(){r.chartTypeSelector.hide()}),r.chartTypeSelector.on("click touchstart","div.cell",function(){var t;e(this).hasClass("disabled")||(t=this.getAttribute("data-hcname"),t!==r.currentChart.config.charttype&&(r.renderChartTypeSelector(t,r.currentChart),r.currentChart.changeType({type:t})))})},r.renderChartTypeSelector=function(e,t){r.chartTypeSelector.find("div.cell").removeClass("selected"),r.chartTypeSelector.find('div.cell[data-hcname="'+e+'"]').addClass("selected"),t.config.datetimeSupported?r.chartTypeSelector.find('div.cell[data-hcname^="TimeSeries"]').removeClass("disabled"):r.chartTypeSelector.find('div.cell[data-hcname^="TimeSeries"]').addClass("disabled")},r.destroyChartTypeSelector=function(t){r.chartIcon.find(".jive_chartMenu").off("click mouseenter touchstart mouseleave touchend").find(".jive_chartSettingsIcon").off("mouseenter"),r.chartIcon.remove();var c=e(".jive_chartTypeSelector[data-reportId='"+t.id+"']");c.length&&(c.off("click touchstart touchend").remove(),r.chartTypeSelector=null)}};return new n});