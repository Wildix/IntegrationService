/**
 * A plugin that provides Telephony functionality.
 * Instance will be created each time when new {@link Wildix.IntegrationService} instance is created. <br />
 * Plugin could be accessible thought {@link Wildix.IntegrationService|IntegrationService}
 * with {@link Wildix.IntegrationService#Telephony|Telephony} property.
 *
 * @class Telephony
 * @memberof Wildix
 * @extends external:Backbone.Collection
 * @example
 * WIService.Telephony.subscribe();
 */
(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(
                require('IntegrationService'),
                require('underscore'),
                require('backbone'),
                require('Models/Call')
        );
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['IntegrationService', 'underscore', 'backbone', 'Models/Call'], factory);
    } else {
        // Browser
        factory(root.IntegrationService, root.underscore, root.Backbone, root.Models.Call);
    }
}(this, function (IntegrationService, _, Backbone, Call){
    'use strict';
    var logger = Logger.get('Telephony');

    IntegrationService.addModule('Telephony', Backbone.Collection.extend({
        model: Call,

        _integrationService: null,
        _connection: null,

        constructor: function(IS) {
            this._integrationService = IS;
            var args = [];
            if(arguments.length > 1){
                args = arguments.slice(1);
            }
            Backbone.Collection.apply(this, args);
        },

        initialize: function(){
            logger.info('Initialize');

            this._connection = this._integrationService.getConnection();

            this._integrationService.on('collaboration:connected', this._onConnectedCollaboration, this);
            this._integrationService.on('setcalls', this._onSetCalls, this);
            this._integrationService.on('updatecall', this._onUpdateCall, this);
            this._integrationService.on('removecall', this._onRemoveCall, this);
            this._integrationService.on('addcall', this._onAddCall, this);
        },

        /**
         * Initiates a call to a specified number.
         *
         * @example
         * WIService.Telephony.call('101');
         *
         * @memberof Wildix.Telephony#
         * @param {string} number A number to call.
         * @param {function} callback Callback function called with result
         * @return {void}
         */
        call: function(number, callback){
            var message = {
                'msgdata': {
                    'type': 'call',
                    'number': number
                }
            };
            this._connection.send(message, callback);
        },

        _subscribed: false,

        /**
         * Returns true if subscribed to a call event.
         *
         * @memberof Wildix.Telephony#
         * @return {boolean}
         */
        isSubscribed: function(){
            return this._subscribed;
        },

        _needSubscribe: false,

        /**
         * Initializes a subscription to call events
         *
         * @memberof Wildix.Telephony#
         * @return {void}
         */
        subscribe: function(){
            this._needSubscribe = true;
            if(this._integrationService.isReady()){
                // if need subscribe and collaboration connected
                // need send subscription
                this._subscribe();
            }
        },

        _subscribe: function(){
            if(this._needSubscribe){
                logger.info('Send subscription');

                this._subscribed = true;

                var message = {
                    'msgdata': {
                        'type': 'subscribe',
                        'event': 'calls'
                    }
                };
                this._connection.send(message);
            }
        },

        _onConnectedCollaboration: function(){
            this._subscribe();
        },

        _onSetCalls: function(calls){
            logger.info('Received calls:', calls);

            this.reset(calls);
        },

        _onUpdateCall: function(call){
            logger.info('Update call:', call);
            var item = this.get(call.channel);
            if(item){
                item.set(call);
            }
        },

        _onRemoveCall: function(call){
            logger.info('Removed call:', call);
            var item = this.get(call.channel);
            if(item){
                this.remove(item);
            }
        },

        _onAddCall: function(call){
            logger.info('Added call:', call);
            if(!this.get(call.channel)){
                this.add(call);
            }
        }
    }));
}));
