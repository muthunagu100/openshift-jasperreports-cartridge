define(["require","jquery","underscore","common/util/classUtil"],function(t){var e=t("jquery"),i=t("underscore"),h=t("common/util/classUtil");return h.extend({constructor:function(t,i){if(this.padding=i?i:{top:5,left:5},!t||0===e(t).length)throw new Error("AttachableComponent should be attached to an element");this.$attachTo=e(t)},show:function(){var t=this.$attachTo.offset(),h=this.$attachTo.height(),o=this.$attachTo.width(),n=e("body"),s=n.height(),r=n.width(),d=this.$el.innerWidth(),l=this.$el.innerHeight(),a=t.top+h+this.padding.top,c=t.left,f=t.top+h+this.padding.top,p=t.left;l+a>s&&(f=t.top-l-this.padding.top),d+c>r&&(p=t.left-d+o),i.extend(this,{top:f,left:p}),this.$el.css({top:this.top,left:this.left}),this.$el.show()},hide:function(){return this.$el.hide(),this.trigger("hide",this),this}})});