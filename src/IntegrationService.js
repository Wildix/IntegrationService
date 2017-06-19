/**
 * @class IntegrationService
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('Logger'), require('EventEmitter'), require('Connector'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['Logger', 'EventEmitter', 'Connector'], factory);
    } else if (typeof Logger !== 'undefined'){
        // Browser
        root.IntegrationService = factory(Logger, EventEmitter, Connector);
    }
}(this, function (Logger, EventEmitter, Connector){
    'use strict';
    // enable all logs
    // Wildix.IntegrationService.Logger.setLevel(Wildix.IntegrationService.Logger.DEBUG)
    // Logger.useDefaults();
    // Logger.setLevel(Logger.WARN);  // Global logging level.
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

    extend(IntegrationService.prototype, EventEmitter, {
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

            extend(this._options, options);

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

        getConnection: function(port) {
            if(this._connection === null){
                this._connection = new Connector(this._connectionOptions);
                this._connection.setAuthData(this._options);
            }
            return this._connection;
        },

        _ready: false,
        isReady: function(){
            return this._ready;
        },

        _onReady: function(){
            this.getVersion();
        },

        _countCollaborationss: 0,
        _onEventWiservice: function(event, data){
            logger.info('_onEventWiservice', event, data);
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

        _onMessage: function(event, data){
            this.trigger(data.msgdata.command, data.msgdata.msgdata);
        },

        _onConnectionError: function(){
            this.trigger('connection:error', this);
        },

        refresh: function(){
            this.getConnection().refresh();
        },

        open: function(){
            this.getConnection().open();
        },

        isConnected: function(){
            return this.getConnection().isConnected();
        },

        _collaborationStatus: null,
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
                        this._ready = true;
                        this.trigger('ready', this);
                        this.trigger('collaboration:' + this._collaborationStatus, this);
                    }
                }.bind(this));
            }
            return this._collaborationStatus;
        },

        getVersion: function(name, force){
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
