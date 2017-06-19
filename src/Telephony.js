/**
 * @class Telephony
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('IntegrationService'), require('EventEmitter'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['IntegrationService', 'EventEmitter'], factory);
    } else if (typeof IntegrationService !== 'undefined' && typeof EventEmitter !== 'undefined'){
        // Browser
        root.Connector = factory(IntegrationService, EventEmitter);
    }
}(this, function (IntegrationService, EventEmitter){
    'use strict';
    var logger = Logger.get('Telephony');

    IntegrationService.addModule('Telephony', extend({}, EventEmitter, {

        _integrationService: null,
        _connection: null,

        initialize: function(IS){
            logger.info('Initialize');

            this._integrationService = IS;
            this._connection = this._integrationService.getConnection();
            this._integrationService.on('collaboration:connected', this._onConnectedCollaboration, this);
        },

        call: function(number, callback){
            var message = {
                'msgdata': {
                    'type': 'call',
                    'number': number
                }
            };
            this._connection.send(message, callback);
        },

        _bindEvents: function(){
            logger.info('_bindEvents');
            this._integrationService.on('setcalls', this._onSetCalls, this);
            this._integrationService.on('updatecall', this._onUpdateCall, this);
            this._integrationService.on('removecall', this._onRemoveCall, this);
            this._integrationService.on('addcall', this._onAddCall, this);
        },

        _calls: null,

        getCalls: function(){
            return this._calls;
        },

        _subscribed: false,
        isSubscribed: function(){
            return this._subscribed;
        },

        _needSubscribe: false,
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

                if(!this._subscribed){
                    // if first subscribe
                    this._bindEvents();
                }

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

        _find: function(item){
            var index = -1;
            for(var i = 0; i < this._calls.length; i++){
                if(this._calls[i].channel == item.channel){
                    index = i;
                    break;
                }
            }
            return index;
        },

        _onConnectedCollaboration: function(){
            this._subscribe();
        },

        _onSetCalls: function(event, calls){
            logger.info('Received calls:', calls);

            var isFirst = (this._calls === null);

            this._calls = calls;

            if(isFirst){
                this.trigger('ready', this);
            }

            this.trigger('reset', this._calls);
        },

        _onUpdateCall: function(event, call){
            logger.info('Update call:', call);
            if(call && this._calls.length > 0){
                var index = this._find(call);
                if(index >= 0){
                    this._calls[index] = call;
                    this.trigger('update', call);
                }
            }
        },

        _onRemoveCall: function(event, call){
            logger.info('Removed call:', call);
            if(call && this._calls.length > 0){
                var index = this._find(call);
                if(index >= 0){
                    this._calls.splice(index, 1);
                    this.trigger('delete', call);
                }
            }
        },

        _onAddCall: function(event, call){
            logger.info('Added call:', call);
            if(call){
                var index = this._find(call);
                if(index == -1){
                    this._calls.push(call);
                    this.trigger('add', call);
                }
            }
        }
    }));
}));
