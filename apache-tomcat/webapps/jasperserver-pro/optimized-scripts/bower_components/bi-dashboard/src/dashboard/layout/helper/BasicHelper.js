define(["require","common/util/classUtil","underscore","backbone"],function(n){var t=n("common/util/classUtil"),o=n("underscore"),i=n("backbone"),e=t.extend({constructor:function(n){this.strategy=n},init:function(n){this.container=n},start:function(){},drag:function(){},stop:function(){},drop:function(){},deinit:function(){}});return o.extend(e.prototype,i.Events),e});