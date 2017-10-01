/**
 * @class Chat
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('IntegrationService'), require('underscore'), require('backbone'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['IntegrationService', 'underscore', 'backbone'], factory);
    } else if (typeof EventEmitter !== 'undefined'){
        // Browser
        root.Connector = factory(root.IntegrationService, root.underscore, root.Backbone);
    }
}(this, function (IntegrationService, _, Backbone){
    'use strict';
    var logger = Logger.get('Chat');

    IntegrationService.addModule('Chat', _.extend({}, Backbone.Events, {

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
