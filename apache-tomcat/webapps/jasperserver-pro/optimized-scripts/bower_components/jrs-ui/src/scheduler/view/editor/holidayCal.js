define("scheduler/view/editor/holidayCal",["require","backbone","bundle!jasperserver_messages","jquery"],function(e){var a=e("backbone"),t=e("bundle!jasperserver_messages"),i=e("jquery");return a.View.extend({el:".calendarBlock",initialize:function(e){var a=this;e.app&&(a.app=e.app),a.collection.on("reset",this.onReset,this)},onReset:function(){var e=i(".calendarBlock"),a=i("[name=calendarSelect]");return e.removeClass("disabled").find("select").attr("disabled",!1),a.empty(""),0===this.collection.size()?(a.append(jQuery("<option>").attr("value","").text(t["report.scheduling.job.edit.trigger.calendars.nocalendars"])),void e.addClass("disabled").find("select").attr("disabled","disabled")):(a.append(jQuery("<option>").attr("value","").text(t["label.none"])),void this.collection.forEach(function(e){a.append(jQuery("<option>").attr("value",e.id).text(e.id))},this))}})});