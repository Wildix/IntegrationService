/**
 * @class Call
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
        root.Models.Call = factory(root.Backbone);
    }
}(this, function (Backbone){
    'use strict';

    var logger = Logger.get('Call');

    return Backbone.Model.extend({
        defaults: {
            name: '',
            number: '',
            channel: '',
            destination: '',
            destinationType: '',
            direction: '',
            duration: '',
            id: '',
            record: '',
            state: '',
            type: ''
        },
        idAttribute: 'channel',
        initialize: function() {
            logger.info('initialize');
        }
    });
}));
