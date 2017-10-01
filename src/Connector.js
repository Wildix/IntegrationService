/**
 * @class Connector
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('ReconnectingWebSocket'), require('underscore'), require('backbone'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['ReconnectingWebSocket', 'underscore', 'backbone'], factory);
    } else if (typeof ReconnectingWebSocket !== 'undefined' && typeof ReconnectingWebSocket !== 'undefined'){
        // Browser
        root.Connector = factory(root.ReconnectingWebSocket, root.underscore, root.Backbone);
    }
}(this, function (ReconnectingWebSocket, _, Backbone){
    'use strict';
    var logger = Logger.get('Connector');

    function Connector(options){
        this.initialize(options);
    }

    _.extend(Connector.prototype, Backbone.Events, {

        _options: {
            debug: false,
            automaticOpen: true,
            reconnectInterval: 1000,
            maxReconnectInterval: 5000,
            reconnectDecay: 1,
            timeoutInterval: 3000,
            maxReconnectAttempts: 1
        },

        _authData: null,

        _connection: null,
        _requestsCallback: {},

        _isInstalled: false,
        _isConnected: false,
        _isAuthorized: false,

        _requestTimeout: 120000,
        _requestTimer: null,

        _currentDefaultPortIndex: 0,
        _defaultPort: [8888, 8889, 8890],

        initialize: function(options){
            logger.info('Initialize', options);

            _.extend(this._options, options);

            var port = window.localStorage.getItem('Wildix.IntegrationService.Port');
            if(port){
                this.getConnection(port);
            }else{
                this.getConnection();
            }
        },

        getConnection: function(port) {
            if(!port){
                port = this._defaultPort[this._currentDefaultPortIndex];
            }
            if(this._connection === null){
                var host = 'wss://wildixintegration.eu:' + port + '/';
                this._connection = new ReconnectingWebSocket(host, null, this._options);

                this._connection.onconnecting = this._onConnectingWS.bind(this);
                this._connection.onopen = this._onOpenWS.bind(this);
                this._connection.onerror = this._onErrorWS.bind(this);
                this._connection.onmessage = this._onMessageWS.bind(this);
                this._connection.onclose = this._onCloseWS.bind(this);
            }
            return this._connection;
        },

        setAuthData: function(data){
            this._authData = data;
        },

        abort: function(){
            this._connection.onconnecting = function(event) {};
            this._connection.onopen = function(event) {};
            this._connection.onerror = function(event) {};
            this._connection.onmessage = function(event) {};
            this._connection.onclose = function(event) {};

            this._connection.close();
            this._connection = null;

            this._isConnected = false;
            this._isAuthorized = false;
        },

        isInstalled: function() {
            return this._isInstalled;
        },

        isConnected: function() {
            return this._isConnected;
        },

        isAuthorized: function() {
            return this._isAuthorized;
        },

        isReady: function(){
            if(this.isInstalled() && this.isConnected() && this.isAuthorized()){
                return true;
            }
            return false;
        },

        refresh: function(){
            this.getConnection().refresh();
        },

        open: function(){
            this.getConnection().open();
        },

        send: function(message, callback, timeout) {
            if(!this.isConnected()){
                return;
            }
            if(!message){
                return;
            }
            if(!message.hasOwnProperty('message')){
                message = _.extend({}, {
                    message: 'E_' + this._authData.app
                }, message);
            }

            if(!message.hasOwnProperty('id')){
                message.id = this._generateID();
            }

            if(callback){
                if(timeout === null || typeof timeout === 'undefined' || timeout < 0){
                    timeout = this._requestTimeout;
                }
                this._requestsCallback[message.id] = {
                    callback: callback,
                    message: message,
                    timeoutAt: Date.now() + timeout
                };

                this._checkRequestTimeout();
            }

            var requestString = JSON.stringify(message);

            return this.getConnection().send(requestString);
        },

        _getCurrentPort: function(){
            return this._connection.url.match(/[^\d]+(\d+).*/)[1];
        },

        _currentCandidat: -1,
        _connectToNextCandidat: function(){
            this._currentCandidat++;

            this._getCandidates(function(candidates){
                if(candidates[this._currentCandidat]){
                    this.abort();
                    this.getConnection(candidates[this._currentCandidat]);
                }else{
                    this.abort();
                    this._currentCandidat = 0;
                    this._candidates = null;
                }
            }.bind(this));
        },

        _candidates: null,
        _getCandidates: function(callback){
            callback = callback || function(){};

            if(this._candidates === null){
                var message = {
                    'message': 'M_WISERVICE',
                    'msgdata': {
                        'command': 'candidates'
                    }
                };

                this.send(message, function(response){
                    if(response && response.candidates){
                        this._candidates = response.candidates;
                        callback(this._candidates);
                    }
                }.bind(this));
            }else{
                callback(this._candidates);
            }
        },

        _autorize: function(){
            if(!this.isConnected()){
                return null;
            }

            if(!this._authData){
                return null;
            }

            var message = {
                'message': 'M_WISERVICE',
                'msgdata': {
                    'command': 'authorize',
                    'msgdata': this._authData
                }
            };
            this.send(message, function(response){
                if(response && response.status && response.status == 'rejected'){
                    logger.info('authorization rejected', response);
                    this._connectToNextCandidat();
                }else{
                    window.localStorage.setItem('Wildix.IntegrationService.Port', this._getCurrentPort());
                    this._isAuthorized = true;
                    this._ready();
                }
            }.bind(this));
        },

        _ready: function(){
            this.trigger('ready', this);
        },

        _checkRequestTimeout: function(){
            if (!this._requestTimer){
                this._requestTimer = setInterval(function(){
                    for (var messageId in this._requestsCallback){
                        if (this._requestsCallback.hasOwnProperty(messageId)){
                            var request = this._requestsCallback[messageId];
                            if (request.timeoutAt && request.timeoutAt <= Date.now()){
                                this.trigger('requesttimeout', request);
                                delete this._requestsCallback[messageId];
                            }
                        }
                    }
                }.bind(this), 100);
            }
        },

        _generateID: function(len) {
            if(!len){
                len = 32;
            }
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for(var i = 0; i < len; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        },

        _onConnectingWS: function(event) {
            this._isConnected = false;
            this.trigger('connecting', this);
        },

        _onOpenWS: function(event) {
            this._isInstalled = true;
            this._isConnected = true;
            this.getConnection().maxReconnectAttempts = null;
            this.trigger('connected', this);
            this._autorize();
        },

        _onErrorWS: function(event, dd) {
            if(this._candidates === null && this._defaultPort[this._currentDefaultPortIndex + 1]){
                // if first connected and have next default port
                if(this._getCurrentPort() == this._defaultPort[this._currentDefaultPortIndex]){
                    // if port is default, then connect to the next default port
                    this._currentDefaultPortIndex++;
                }
                this.abort();
                this.getConnection();
            }else{
                this.abort();
                this.trigger('error', this);
            }
        },

        _onMessageWS: function(event) {
            var message = null;
            if(event.hasOwnProperty('data') && event.data){
                try{
                    message = JSON.parse(event.data);
                }catch(e){
                    logger.error('Bad message', e);
                }
            }
            if(message && message.hasOwnProperty('message')){
                switch (message.message.substr(0, 2)) {
                    case 'E_': message.type = 'event';
                        break;
                    case 'R_': message.type = 'response';
                        break;
                    case 'C_': message.type = 'chunked';
                        break;
                    default: message.type = 'message';
                        break;
                }

                message.application = message.message.substr(2);
                message.application = message.application.toLowerCase();
            }

            if(message && message.hasOwnProperty('id')){
                if(message.type == 'response' && this._requestsCallback.hasOwnProperty(message.id)){
                    if(this._requestsCallback[message.id].hasOwnProperty('callback')){
                        this._requestsCallback[message.id].callback(message.msgdata);
                    }
                    delete this._requestsCallback[message.id];
                }
            }

            this.trigger(message.type + ':' + message.application, message);
        },

        _onCloseWS: function(event) {
            if(this._isConnected){
                this._isConnected = false;
                logger.error('WS closed', event);
                this.trigger('close', this);
            }
        }
    });

    return Connector;
}));
