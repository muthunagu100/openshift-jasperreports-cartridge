define(["require","!domReady","resource.dataType","underscore","jquery","jrs.configs","resource.base","components.calendarInput","utils.common"],function(e){function a(){return r.indexOf([3,4,5],i.addDataType.type)>-1}var n=e("!domReady"),t=e("resource.dataType"),r=e("underscore"),o=e("jquery"),i=e("jrs.configs"),c=e("resource.base"),d=e("components.calendarInput");e("utils.common"),n(function(){var e=i.addDataType.localContext.initOptions;if(r.extend(window.localContext,i.addDataType.localContext),r.extend(c.messages,i.addDataType.resource.messages),a()){var n=new d(i.addDataType.minValueText);n.container=o("label.minPicker"),n.create();var s=new d(i.addDataType.maxValueText);s.container=o("label.maxPicker"),s.create()}t.initialize(e),isIPad()&&c.initSwipeScroll()})});