/**
 * @class Location
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('backbone'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['backbone'], factory);
    } else {
        // Browser
        root.Models = root.Models || {};
        root.Models.Location = factory(root.Backbone);
    }
}(this, function (Backbone){
    'use strict';

    var logger = Logger.get('Location');

    return Backbone.Model.extend({
        defaults: {
            address: '',
            lat: '',
            lng: ''
        },
        initialize: function() {
            logger.info('initialize');
        }
    });
}));
