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
            this._sendMessage('call', {'number': number}, callback);
        },

        /**
         * Initiates an answer to the call for the specified channel.
         *
         * @example
         * WIService.Telephony.answer('SIP/108-00000050');
         *
         * @memberof Wildix.Telephony#
         * @param {string} channel A call channel.
         * @param {function} callback Callback function called with result
         * @return {void}
         */
        answer: function(channel, callback){
            this._sendMessage('answer', {'channel': channel}, callback);
        },

        /**
         * Initiates a call hangup for the specified channel.
         *
         * @example
         * WIService.Telephony.hangup('SIP/108-00000050');
         *
         * @memberof Wildix.Telephony#
         * @param {string} channel A call channel.
         * @param {function} callback Callback function called with result
         * @return {void}
         */
        hangup: function(channel, callback){
            this._sendMessage('hangup', {'channel': channel}, callback);
        },

        /**
         * Initiates a call hold for the specified channel.
         *
         * @example
         * WIService.Telephony.hold('SIP/108-00000050');
         *
         * @memberof Wildix.Telephony#
         * @param {string} channel A call channel.
         * @param {function} callback Callback function called with result
         * @return {void}
         */
        hold: function(channel, callback){
            this._sendMessage('hold', {'channel': channel}, callback);
        },

        /**
         * Initiates a call unhold for the specified channel.
         *
         * @example
         * WIService.Telephony.unhold('SIP/108-00000050');
         *
         * @memberof Wildix.Telephony#
         * @param {string} channel A call channel.
         * @param {function} callback Callback function called with result
         * @return {void}
         */
        unhold: function(channel, callback){
            this._sendMessage('unhold', {'channel': channel}, callback);
        },

        _sendMessage: function(type, data, callback){
            var message = {
                'msgdata': {
                    'type': type
                }
            };
            _.extend(message.msgdata, data);
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
                this._sendMessage('subscribe', {'event': 'calls'});
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

            if (!item) {
                return;
            }

            item.set(call);

            if (call.state === 'up') {
                var previousState = item.previousAttributes().state;

                if (previousState === 'ring' && call.direction === 'incoming') {
                    this.trigger('answer', call);
                } else if (previousState === 'hold') {
                    this.trigger('unhold', call);
                }
            } else if (call.state === 'hold') {
                this.trigger('hold', call);
            }
        },

        _onRemoveCall: function(call){
            logger.info('Removed call:', call);
            var item = this.get(call.channel);
            if(item){
                this.remove(item);
                this.trigger('hangup', call);
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

/**
 * Indicates that the current user has answered the call.
 *
 * @event Wildix.Telephony#answer
 * @example
 * WIService.Telephony.on('answer', function (call) {
 *    console.log('Answer to the call', call)
 * });
 */

/**
 * Indicates that the current user has put the call on hold.
 *
 * @event Wildix.Telephony#hold
 * @example
 * WIService.Telephony.on('hold', function (call) {
 *    console.log('Hold the call', call)
 * });
 */

/**
 * Indicates that the current user has unhold the call.
 *
 * @event Wildix.Telephony#unhold
 * @example
 * WIService.Telephony.on('unhold', function (call) {
 *    console.log('Unhold the call', call)
 * });
 */

/**
 * Indicates that someone of the call participants has a hang-up.
 *
 * @event Wildix.Telephony#hangup
 * @example
 * WIService.Telephony.on('hangup', function (call) {
 *    console.log('Hangup the call', call)
 * });
 */
