define(["require","lodash.custom","underscore.string"],function(e){var s=e("lodash.custom");return s.str=e("underscore.string"),s.templateSettings={evaluate:/\{\{([\s\S]+?)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,escape:/\{\{-([\s\S]+?)\}\}/g},s.mixin(s.str.exports()),s});