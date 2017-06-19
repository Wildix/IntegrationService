/**
 * @class Roster
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
    var logger = Logger.get('Roster');

    IntegrationService.addModule('Roster', extend({}, EventEmitter, {

        _integrationService: null,
        _connection: null,

        initialize: function(IS){
            logger.info('Initialize');

            this._integrationService = IS;
            this._connection = this._integrationService.getConnection();
            this._integrationService.on('collaboration:connected', this._onConnectedCollaboration, this);
        },

        _bindEvents: function(){
            logger.info('_bindEvents');
            this._integrationService.on('setroster', this._onSetRoster, this);
            this._integrationService.on('updateuser', this._onUpdateUser, this);
            this._integrationService.on('removeuser', this._onRemoveUser, this);
            this._integrationService.on('adduser', this._onAddUser, this);
        },

        _roster: null,

        getRoster: function(){
            return this._roster;
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
                        'event': 'roster'
                    }
                };

                this._connection.send(message);
            }
        },

        _sort: function(){
            this._roster.sort(function compare(a, b){
                return a.name.localeCompare(b.name);
            });
        },

        _find: function(item){
            var index = -1;
            for(var i = 0; i < this._roster.length; i++){
                if(this._roster[i].id == item.id){
                    index = i;
                    break;
                }
            }
            return index;
        },

        _onConnectedCollaboration: function(){
            this._subscribe();
        },

        _onSetRoster: function(event, roster){
            logger.info('Received roster:', roster);

            var isFirst = (this._roster === null);

            this._roster = roster;
            this._sort();

            if(isFirst){
                this.trigger('ready', this);
            }

            this.trigger('reset', this._roster);
        },

        _onUpdateUser: function(event, user){
            logger.info('Update user:', user);
            if(user && this._roster.length > 0){
                var index = this._find(user);
                if(index >= 0){
                    this._roster[index] = user;
                    this.trigger('update', user);
                }
            }
        },

        _onRemoveUser: function(event, user){
            logger.info('Removed user:', user);
            if(user && this._roster.length > 0){
                var index = this._find(user);
                if(index >= 0){
                    this._roster.splice(index, 1);
                    this.trigger('delete', user);
                }
            }
        },

        _onAddUser: function(event, user){
            logger.info('Added user:', user);
            if(user){
                var index = this._find(user);
                if(index == -1){
                    this._roster.push(user);
                    this._sort();
                    this.trigger('add', user);
                }
            }
        }
    }));
}));
