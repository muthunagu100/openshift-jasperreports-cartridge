/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor Nesterenko, Zakhar Tomchenko
 */

;(function(root, _, jasper) {
    var version = "0.0.1a",
        visualizeData = {
            bis: {},
            auths: [],
            facts: {},
            config: {}
        };

    visualizeData.auths.find = function(server, auth) {
        return _.find(this, _.compose(_.partial(_.isEqual, _.extend({url: server}, auth)), function(auth) {
            return auth.properties();
        }));
    };

    var visualize = function (param, param2, param3, param4) {
        var properties, bi, callback, errback, always;

        if (typeof param == 'function') {
            properties = visualizeData.config;
            callback = param;
            errback = param2;
            always = param3;
        } else {
            properties = _.extend({}, visualizeData.config, param);
            callback = param2;
            errback = param3;
            always = param4;
        }

        bi = visualizeData.bis[properties.server];
        if (!bi) {
            bi = jasper({
                url : properties.server,
                scripts: properties.scripts,
                logEnabled: properties.logEnabled,
                logLevel: properties.logLevel
            });
            visualizeData.bis[properties.server] = bi;
        }

        bi(["bi/component/factory/BiComponentFactory", "bi/component/Authentication"], function(BiComponentFactory, Authentication) {
            var auth = visualizeData.auths.find(properties.server, properties.auth),
                factory = visualizeData.facts[properties.server];

            if (!auth) {
                auth = new Authentication(_.extend({url: properties.server}, properties.auth));
                visualizeData.auths.push(auth);
            }

            if (!factory) {
                factory = new BiComponentFactory({server: properties.server});
                visualizeData.facts[properties.server] = factory;
            }

            // TODO temporary, awaits Authentication to be done
            auth._result || (auth._result = auth.run());

            auth._result
                .fail(errback)
                .always(function(result) {
                    if (auth._result.state() === "resolved") {
                        var v = createV(factory, auth);
                        callback && callback(v);
                        always && always(null, v);
                    } else {
                        always && always(result);
                    }
                });

            // TODO end
        });
    };

    visualize.version = version;
    visualize.config = function(config) {
        _.extend(visualizeData.config, config);
    };

    function createV(factory, auth){
        var v = function (param) {
            if (typeof param == 'string' || Object.prototype.toString.call(param) === "[object String]") {
                // v("#container").report({...});
                return {
                    report: (function(selector) {
                        return function(options) {
                            factory.report(_.extend({container: selector}, options));
                        }
                    })(param)
                }
            }
        };
        v.logout = auth.logout;
        v.login = auth.login;
        _.extend(v, factory);
        return v;
    }

    // noConflict functionality
    var _visualize = root.visualize;

    visualize.noConflict = function () {
        if (root.visualize === visualize) {
            root.visualize = _visualize;
        }

        return visualize;
    };

    // Add visualize to global scope
    root.visualize = visualize;

})(this, _, jasper);






