/**
 * A plugin that provides Roster functionality.
 * Instance will be created each time when new {@link Wildix.IntegrationService} instance is created. <br />
 * Plugin could be accessible thought {@link Wildix.IntegrationService|IntegrationService}
 * with {@link Wildix.IntegrationService#Roster|Roster} property.
 *
 * @class Roster
 * @memberof Wildix
 * @extends external:Backbone.Collection
 * @example
 * WIService.Roster.subscribe();
 */
(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(
                require('IntegrationService'),
                require('underscore'),
                require('backbone'),
                require('Models/User')
        );
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['IntegrationService', 'underscore', 'backbone', 'Models/User'], factory);
    } else {
        // Browser
        factory(root.IntegrationService, root.underscore, root.Backbone, root.Models.User);
    }
}(this, function (IntegrationService, _, Backbone, User){
    'use strict';
    var logger = Logger.get('Roster');

    IntegrationService.addModule('Roster', Backbone.Collection.extend({
        model: User,

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

        initialize: function(IS){
            logger.info('initialize');

            this._connection = this._integrationService.getConnection();

            this._integrationService.on('collaboration:connected', this._onConnectedCollaboration, this);
            this._integrationService.on('setroster', this._onSetRoster, this);
            this._integrationService.on('updateuser', this._onUpdateUser, this);
            this._integrationService.on('removeuser', this._onRemoveUser, this);
            this._integrationService.on('adduser', this._onAddUser, this);
        },

        _subscribed: false,

        /**
         * Returns true if subscribed to a roster event.
         *
         * @memberof Wildix.Roster#
         * @return {boolean}
         */
        isSubscribed: function(){
            return this._subscribed;
        },

        _needSubscribe: false,

        /**
         * Initializes a subscription to roster events
         *
         * @memberof Wildix.Roster#
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
                        'event': 'roster'
                    }
                };

                this._connection.send(message);
            }
        },

        _prepareUser: function(item){
            var user = _.clone(item);
            user.location = item.presence.extra.location;
            user.call = item.presence.extra.call;
            user.presence = {
                type: item.presence.type,
                show: item.presence.show,
                status: item.presence.status,
                deviceShow: item.presence.extra['device-show'],
                until: item.presence.until
            };

            return user;
        },

        _onConnectedCollaboration: function(){
            this._subscribe();
        },

        _onSetRoster: function(roster){
            logger.info('Received roster:', roster);
            var newRoster = [];
            for(var i = 0; i < roster.length; i++){
                newRoster.push(this._prepareUser(roster[i]));
            }
            this.reset(newRoster);
        },

        _onUpdateUser: function(user){
            logger.info('Update user:', user);
            var item = this.get(user.id);
            if(item){
                item.set(this._prepareUser(user));
            }
        },

        _onRemoveUser: function(user){
            logger.info('Removed user:', user);
            var item = this.get(user.id);
            if(item){
                this.remove(item);
            }
        },

        _onAddUser: function(user){
            logger.info('Added user:', user);

            if(!this.get(user.id)){
                this.add(this._prepareUser(user));
            }
        }
    }));
}));
