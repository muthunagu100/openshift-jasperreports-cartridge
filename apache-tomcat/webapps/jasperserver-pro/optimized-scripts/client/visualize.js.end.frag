
    jQuery.noConflict(true);
    jasper.noConflict(true);
    _.noConflict();
    //Remove Backbone from global scope but keep in local scope.
    //So it can be then accessed inside closure simply as 'Backbone'
    var Backbone = global.Backbone.noConflict();

    //Expose __jrsConfigs__ as a property of visualize to be able to configure it
    visualize.__jrsConfigs__ = __jrsConfigs__;
}(this));
