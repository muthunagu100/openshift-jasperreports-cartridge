define(["require","backbone","./trait/viewRivetsTrait","underscore"],function(e){var t=e("backbone"),i=e("./trait/viewRivetsTrait"),n=e("underscore"),o=t.View.extend({el:function(){return this.template({i18n:this.i18n,model:this.model.toJSON(),options:this.options})},constructor:function(e){if(e||(e={}),!e.template)throw new Error("Template must be defined");if(!e.model)throw new Error("Model must be defined");this.template=n.template(e.template),this.model=e.model,this.i18n=e.i18n||{},this.options=n.omit(e,"model","template","i18n"),t.View.apply(this,arguments)},render:function(){return this.bindRivets(),this},remove:function(){this.unbindRivets(),t.View.prototype.remove.apply(this,arguments)}});return n.extend(o.prototype,i),o});