/**
 * <p></p>
 *
 * @author Zakhar.Tomchenco
 * @version $Id: TreeDataLayer.js 399 2014-11-12 12:02:18Z ktsaregradskyi $
 * @since
 */

define(function(require){
    "use strict";

    require("jquery.ui");

    var _ = require('underscore'),
        $ = require('jquery'),
        ClassUtil = require('common/util/classUtil'),
        TreeLevel = require("./TreeLevel"),

        request = require("common/transport/request");

    return ClassUtil.extend({
        constructor: function(options){
            this.requestType = options.requestType ? options.requestType : "GET";

            options.getDataUri && (this.getDataUri = options.getDataUri);
            this.getDataUri || (this.getDataUri = _.template(options.dataUriTemplate));

            options.getDataArray && (this.getDataArray = options.getDataArray);
            options.getDataSize && (this.getDataSize = options.getDataSize);

            options.extractId && (this.extractId = options.extractId);
            this.levelDataId = options.levelDataId ? options.levelDataId : "id";

            this.processors = options.processors || [];

            this.initialize(options);
        },

        initialize: function(options){
        },

        extractId: function(item) {
            return item[this.levelDataId];
        },

        getDataSize: function(data, status, xhr) {
            return this.getDataArray(data, status, xhr).length;
        },

        getDataArray: function(data, status, xhr) {
            throw new Error("Must be overridden!")
        },

        obtainData: function(options, level) {
            var result = new $.Deferred(), self = this;

            if (this.predefinedData && this.predefinedData[options.id]) {
                result.resolve({
                    total: this.predefinedData[options.id].length,
                    data: this.predefinedData[options.id]
                });
            } else {
                request({
                    type: this.requestType,
                    dataType: this.dataType || "json",
                    headers: {
                        Accept: this.accept || "application/json",
                        "Content-Type": this.contentType || undefined
                    },
                    data: this.data || undefined,
                    url: this.getDataUri(options)
                }).done(function() {
                        self.dataSize = self.getDataSize.apply(self, arguments);
                        result.resolve({
                            total: self.dataSize,
                            data: process.call(self, self.getDataArray.apply(self, arguments), options)
                        });
                    }).fail(function(xhr) {
                        result.reject(xhr.status, xhr.responseText);
                    });
            }

            return result;
        },

        _process: process
    });

    function process(data, options){
        return invokeProcessors.call(this, changeDataStructure.call(this, data), options);
    }

    function changeDataStructure(data) {
        for (var i = 0, l = data.length; i < l; i++) {
            data[i] = {
                id: this.extractId(data[i]),
                value: data[i]
            }
        }

        return data;
    }

    function invokeProcessors(data, options){
        var processedData, processedItem;
        if (this.processors && this.processors.length){
            for (var i = 0, l = this.processors.length; i<l; i++){
                processedData = [];
                for (var j = 0, le = data.length; j<le; j++){
                    processedItem = this.processors[i].processItem(data[j], options, this);
                    processedItem && processedData.push(processedItem);
                }
                data = processedData;
            }
        }
        return data;
    }
});
