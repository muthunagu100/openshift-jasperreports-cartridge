define(["require","./BiComponentError","./enum/biComponentErrorCodes","./enum/biComponentErrorMessages"],function(o){var r=o("./BiComponentError"),n=o("./enum/biComponentErrorCodes"),e=o("./enum/biComponentErrorMessages");return r.extend({constructor:function(o){r.prototype.constructor.call(this,n.CONTAINER_NOT_FOUND_ERROR,e[n.CONTAINER_NOT_FOUND_ERROR],[o])}})});