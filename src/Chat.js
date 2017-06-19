/**
 * @class Chat
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('IntegrationService'), require('EventEmitter'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['IntegrationService', 'EventEmitter'], factory);
    } else if (typeof EventEmitter !== 'undefined'){
        // Browser
        root.Connector = factory(IntegrationService, EventEmitter);
    }
}(this, function (IntegrationService, EventEmitter){
    'use strict';
    var logger = Logger.get('Chat');

    IntegrationService.addModule('Chat', extend({}, EventEmitter, {

        _integrationService: null,
        _connection: null,

        initialize: function(IS){
            logger.info('Initialize');

            this._integrationService = IS;
            this._connection = this._integrationService.getConnection();
        },

        open: function(number){
            var message = {
                'msgdata': {
                    'type': 'chat',
                    'number': number
                }
            };
            this._connection.send(message);
        }

    }));
}));
