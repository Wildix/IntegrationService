/**
 * Represents call information.<br />
 * Used in user model and can be received from {@link Wildix.Models.User}.<br />
 * Used in Telephony plugin and can be received from {@link Wildix.Telephony}.
 *
 * @class Call
 * @memberof Wildix.Models
 * @extends external:Backbone.Model
 *
 * @property name {string} name of the connected call.
 * @property number {string} number of the connected call.
 * @property channel {string}
 * @property destination {string}
 * @property destinationType {string}
 * @property direction {string}
 * @property duration {string}
 * @property id {string}
 * @property record {string}
 * @property state {string}
 * @property type {string}
 * @example
 * user.get('call').get(property)
 * or
 * call.get(property)
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
