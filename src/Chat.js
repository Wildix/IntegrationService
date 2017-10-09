/**
 * A plugin that provides Chat functionality.
 * Instance will be created each time when new {@link Wildix.IntegrationService} instance is created. <br />
 * Plugin could be accessible thought {@link Wildix.IntegrationService|IntegrationService}
 * with {@link Wildix.IntegrationService#Chat|Chat} property.
 *
 * @class Chat
 * @memberof Wildix
 * @extends external:Backbone.Events
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
        factory(root.IntegrationService, root.underscore, root.Backbone);
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

        /**
         * Initiates a open chat to a specified extension.
         *
         * @example
         * WIService.Chat.open('101');
         *
         * @memberof Wildix.Chat#
         * @param {string} number  A number to open chat.
         * @return {void}
         */
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
