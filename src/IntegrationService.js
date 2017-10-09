/**
 * Represents a Wildix IntegrationService instance
 *
 * @class IntegrationService
 * @memberof Wildix
 * @extends external:Backbone.Events
 *
 * @param options {Object} options
 *
 * @example
 * var WIService = new Wildix.IntegrationService({
 *   name: "MySomeApplication",
 *   version: '1.0.0'
 * }
 */
(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('Logger'), require('underscore'), require('backbone'), require('Connector'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['Logger', 'underscore', 'backbone', 'Connector'], factory);
    } else {
        // Browser
        root.IntegrationService = factory(root.Logger, root.underscore, root.Backbone, root.Connector);
    }
}(this, function (Logger, _, Backbone, Connector){
    'use strict';
    // enable all logs
    // Wildix.IntegrationService.Logger.setLevel(Wildix.IntegrationService.Logger.DEBUG)
    // Logger.useDefaults();
    // Logger.setLevel(Logger.DEBUG);  // Global logging level.

    var logger = Logger.get('IntegrationService');

    function IntegrationService(options){
        this.initialize(options);
    }

    IntegrationService.Logger = Logger;

    IntegrationService.Modules = {};

    IntegrationService.addModule = function(name, module){
        IntegrationService.Modules[name] = module;
    };

    _.extend(IntegrationService.prototype, Backbone.Events, {
        _options: {
            app: 'APP_WEBCRM',
            name: 'WebCRM',
            version: '0.0.1',
            userAgent: navigator.userAgent,
            platform: navigator.platform
        },

        _connectionOptions: {
            debug: false,
            automaticOpen: true,
            reconnectInterval: 1000,
            maxReconnectInterval: 5000,
            reconnectDelay: 1,
            timeoutInterval: 3000,
            maxReconnectAttempts: 1
        },

        _connection: null,

        _macComponentVersion: {
            'wiservice': '2.5.0'
        },

        _winComponentVersion: {
            'wiservice': '2.5.0'
        },

        _version: null,

        initialize: function(options){
            logger.info('Initialize Integration service', options);

            _.extend(this._options, options);

            this._options.app = 'APP_' + this._options.name.toUpperCase();

            for (var key in IntegrationService.Modules) {
                logger.info('Build module:', key);
                if(typeof IntegrationService.Modules[key] === 'object'){
                    var Module = function(){};
                    Module.prototype = IntegrationService.Modules[key];

                    this[key] = new Module();
                    this[key].initialize(this);
                }else{
                    this[key] = new IntegrationService.Modules[key](this);
                }
            }

            this.getConnection().on('ready', this._onReady, this);
            this.getConnection().on('event:wiservice', this._onEventWiservice, this);
            this.getConnection().on('message:' + this._options.app.toLowerCase(), this._onMessage, this);
            this.getConnection().on('error', this._onConnectionError, this);
        },

        /**
         * Plugin that provides Roster functionality
         *
         * @memberof Wildix.IntegrationService#
         * @type {Wildix.Roster}
         */
        Roster: null,

        /**
         * Plugin that provides Telephony functionality
         *
         * @memberof Wildix.IntegrationService#
         * @type {Wildix.Telephony}
         */
        Telephony: null,

        /**
         * Plugin that provides Chat functionality
         *
         * @memberof Wildix.IntegrationService#
         * @type {Wildix.Chat}
         */
        Chat: null,

        /**
         * Return connection to WIService.
         *
         * @memberof Wildix.IntegrationService#
         * @return {Wildix.Connector}
         */
        getConnection: function() {
            if(this._connection === null){
                this._connection = new Connector(this._connectionOptions);
                this._connection.setAuthData(this._options);
            }
            return this._connection;
        },

        _ready: false,

        /**
         * Return true if fully initialized connection with WIService.
         *
         * @memberof Wildix.IntegrationService#
         * @return {boolean}
         */
        isReady: function(){
            return this._ready;
        },

        _onReady: function(){
            this._getVersion();
        },

        _countCollaborationss: 0,
        _onEventWiservice: function(data){
            logger.info('_onEventWiservice', data);
            if(data && data.msgdata){
                if(data.msgdata.type == 'connectionstatus'){
                    if(data.msgdata.disconnected && data.msgdata.disconnected.collaboration){
                        // maybe disconnected
                        if(data.msgdata.connected && data.msgdata.connected.collaboration){
                            // have another collaboration connection
                        }else{
                            this._collaborationStatus = 'disconnected';
                            this.trigger('collaboration:' + this._collaborationStatus, this);
                        }
                    }else if(data.msgdata.connected && data.msgdata.connected.collaboration){
                        if(this._countCollaborations != data.msgdata.connected.collaboration.length){
                            this._collaborationStatus = 'connected';
                            this.trigger('collaboration:' + this._collaborationStatus, this);
                        }
                    }

                    this._countCollaborations = 0;
                    if(data.msgdata.connected && data.msgdata.connected.collaboration){
                        this._countCollaborations = data.msgdata.connected.collaboration.length;
                    }
                }
            }
        },

        _onMessage: function(data){
            this.trigger(data.msgdata.command, data.msgdata.msgdata);
        },

        _onConnectionError: function(){
            this.trigger('connection:error', this);
        },

        /**
         * Return true if IntegrationService connected to the WIService.
         *
         * @memberof Wildix.IntegrationService#
         * @return {boolean}
         */
        isConnected: function(){
            return this.getConnection().isConnected();
        },

        _collaborationStatus: null,

        /**
         * Return collaboration status or null if IntegrationService not connected to the WIService.
         *
         * @memberof Wildix.IntegrationService#
         * @return {string|null}
         */
        getCollaborationStatus: function(){
            if(!this.isConnected()){
                return null;
            }
            if(this._collaborationStatus === null){
                var message = {
                    'message': 'M_WISERVICE',
                    'msgdata': {
                        'command': 'getconnectionstatus'
                    }
                };
                this.getConnection().send(message, function(response){
                    logger.info('collaboration status', response);
                    var connected = response.connected || {};
                    if(connected.collaboration && connected.collaboration.length > 0){
                        this._collaborationStatus = 'connected';
                        this._countCollaborations = response.connected.collaboration.length;
                        this.trigger('collaboration:' + this._collaborationStatus, this);
                        this._ready = true;
                        this.trigger('ready', this);
                    }
                }.bind(this));
            }
            return this._collaborationStatus;
        },

        /**
         * Return collaboration version.
         *
         * @memberof Wildix.IntegrationService#
         * @private
         * @param {string} name of app
         * @param {bollean} force request version
         * @return {string}
         */
        _getVersion: function(name, force){
            if(!this.isConnected()){
                return null;
            }

            if(this._version === null || force){
                var message = {
                    'message': 'M_WISERVICE',
                    'msgdata': {
                        'command': 'getversion'
                    }
                };
                this.getConnection().send(message, function(response){
                    if(response && response.wiservice){
                        this._version = response;
                        this.getCollaborationStatus();
                    }
                }.bind(this));
            }

            if(name){
                if(this._version && this._version.hasOwnProperty(name) && this._version[name]){
                    return this._version[name];
                }
                return null;
            }
            return this._version;
        }
    });

    return IntegrationService;
}));

/**
 * Indicates that could not connect to WIService.
 *
 * @event Wildix.IntegrationService#connection:error
 * @property IntegrationService {Wildix.IntegrationService}
 * @example
 * WIService.on('connection:error', function(){
 *   console.warn('WIService not installed or is not running');
 * });
 */

/**
 * Indicates that collaboration is connected and IntegrationService received status.
 *
 * @event Wildix.IntegrationService#ready
 * @property IntegrationService {Wildix.IntegrationService}
 * @example
 * WIService.on('ready', function(){
 *   var status = WIService.getCollaborationStatus();
 *   if(status == 'disconnected'){
 *       console.warn('Collaboration not running');
 *   }
 * });
 */

/**
 * Indicates that Collaboration is connected to WIService.
 *
 * @event Wildix.IntegrationService#collaboration:connected
 * @property IntegrationService {Wildix.IntegrationService}
 * @example
 * WIService.on('collaboration:connected', function(){
 *   console.log('Collaboration connected');
 * });
 */

/**
 * Indicates that Collaboration is disconnected from the WIService.
 *
 * @event Wildix.IntegrationService#collaboration:disconnected
 * @property IntegrationService {Wildix.IntegrationService}
 * @example
 * WIService.on('collaboration:disconnected', function(){
 *   console.log('Collaboration disconnected');
 * });
 */
