(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IntegrationService"] = factory();
	else
		root["Wildix"] = root["Wildix"] || {}, root["Wildix"]["IntegrationService"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(extend) {

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @class EventEmitter
 */

(function universalModuleDefinition(root, factory){
    if (true){
        // CommonJS
        module.exports = factory();
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define([], factory);
    } else if (typeof IntegrationService !== 'undefined' && typeof ReconnectingWebSocket !== 'undefined'){
        // Browser
        root.EventEmitter = factory();
    }
}(this, function (){
    'use strict';
    var EventEmitter = {
        _handlers: null,

        on: function(event, fn, scope) {
            this._handlers = this._handlers || {};
            if(typeof this._handlers[event] === 'undefined'){
                this._handlers[event] = [];
            }

            this._handlers[event].push({
                fn: fn,
                scope: scope
            });
        },

        off: function(event, fn) {
            if(typeof this._handlers[event] === 'undefined'){
                return true;
            }

            this._handlers[event] = this._handlers[event].filter(
                function(item) {
                    if (item.fn !== fn) {
                        return item;
                    }
                }
            );
        },

        trigger: function(event, param) {
            // console.log('trigger', event, param)

            var args = arguments;

            if(!this._handlers || typeof this._handlers[event] === 'undefined'){
                return;
            }

            var handlers = this._handlers[event];

            for (var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];
                if(handler.fn){
                    switch (args.length) {
                        // fast cases
                        case 1:
                            handler.fn.call(handler.scope, event);
                            break;
                        case 2:
                            handler.fn.call(handler.scope, event, param);
                            break;
                        case 3:
                            handler.fn.call(handler.scope, event, param, args[2]);
                            break;
                            // slower
                        default:
                            handler.fn.apply(handler.scope, args);
                    }
                }
            }
        }
    };

    return EventEmitter;
}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * js-logger - http://github.com/jonnyreeves/js-logger
 * Jonny Reeves, http://jonnyreeves.co.uk/
 * js-logger may be freely distributed under the MIT license.
 */
(function (global) {
	"use strict";

	// Top level module for the global, static logger instance.
	var Logger = { };

	// For those that are at home that are keeping score.
	Logger.VERSION = "1.3.0";

	// Function which handles all incoming log messages.
	var logHandler;

	// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
	var contextualLoggersByNameMap = {};

	// Polyfill for ES5's Function.bind.
	var bind = function(scope, func) {
		return function() {
			return func.apply(scope, arguments);
		};
	};

	// Super exciting object merger-matron 9000 adding another 100 bytes to your download.
	var merge = function () {
		var args = arguments, target = args[0], key, i;
		for (i = 1; i < args.length; i++) {
			for (key in args[i]) {
				if (!(key in target) && args[i].hasOwnProperty(key)) {
					target[key] = args[i][key];
				}
			}
		}
		return target;
	};

	// Helper to define a logging level object; helps with optimisation.
	var defineLogLevel = function(value, name) {
		return { value: value, name: name };
	};

	// Predefined logging levels.
	Logger.DEBUG = defineLogLevel(1, 'DEBUG');
	Logger.INFO = defineLogLevel(2, 'INFO');
	Logger.TIME = defineLogLevel(3, 'TIME');
	Logger.WARN = defineLogLevel(4, 'WARN');
	Logger.ERROR = defineLogLevel(8, 'ERROR');
	Logger.OFF = defineLogLevel(99, 'OFF');

	// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
	// of each other.
	var ContextualLogger = function(defaultContext) {
		this.context = defaultContext;
		this.setLevel(defaultContext.filterLevel);
		this.log = this.info;  // Convenience alias.
	};

	ContextualLogger.prototype = {
		// Changes the current logging level for the logging instance.
		setLevel: function (newLevel) {
			// Ensure the supplied Level object looks valid.
			if (newLevel && "value" in newLevel) {
				this.context.filterLevel = newLevel;
			}
		},

		// Is the logger configured to output messages at the supplied level?
		enabledFor: function (lvl) {
			var filterLevel = this.context.filterLevel;
			return lvl.value >= filterLevel.value;
		},

		debug: function () {
			this.invoke(Logger.DEBUG, arguments);
		},

		info: function () {
			this.invoke(Logger.INFO, arguments);
		},

		warn: function () {
			this.invoke(Logger.WARN, arguments);
		},

		error: function () {
			this.invoke(Logger.ERROR, arguments);
		},

		time: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'start' ]);
			}
		},

		timeEnd: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'end' ]);
			}
		},

		// Invokes the logger callback if it's not being filtered.
		invoke: function (level, msgArgs) {
			if (logHandler && this.enabledFor(level)) {
				logHandler(msgArgs, merge({ level: level }, this.context));
			}
		}
	};

	// Protected instance which all calls to the to level `Logger` module will be routed through.
	var globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

	// Configure the global Logger instance.
	(function() {
		// Shortcut for optimisers.
		var L = Logger;

		L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
		L.debug = bind(globalLogger, globalLogger.debug);
		L.time = bind(globalLogger, globalLogger.time);
		L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
		L.info = bind(globalLogger, globalLogger.info);
		L.warn = bind(globalLogger, globalLogger.warn);
		L.error = bind(globalLogger, globalLogger.error);

		// Don't forget the convenience alias!
		L.log = L.info;
	}());

	// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
	// object with the supplied log messages and the second being a context object which contains a hash of stateful
	// parameters which the logging function can consume.
	Logger.setHandler = function (func) {
		logHandler = func;
	};

	// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
	// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
	Logger.setLevel = function(level) {
		// Set the globalLogger's level.
		globalLogger.setLevel(level);

		// Apply this level to all registered contextual loggers.
		for (var key in contextualLoggersByNameMap) {
			if (contextualLoggersByNameMap.hasOwnProperty(key)) {
				contextualLoggersByNameMap[key].setLevel(level);
			}
		}
	};

	// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
	// default context and log handler.
	Logger.get = function (name) {
		// All logger instances are cached so they can be configured ahead of use.
		return contextualLoggersByNameMap[name] ||
			(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
	};

	// CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
	// write to the window's console object (if present); the optional options object can be used to customise the
	// formatter used to format each log message.
	Logger.createDefaultHandler = function (options) {
		options = options || {};

		options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
			// Prepend the logger's name to the log message for easy identification.
			if (context.name) {
				messages.unshift("[" + context.name + "]");
			}
		};

		// Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations in environments
		// that don't offer a native console method.
		var timerStartTimeByLabelMap = {};

		// Support for IE8+ (and other, slightly more sane environments)
		var invokeConsoleMethod = function (hdlr, messages) {
			Function.prototype.apply.call(hdlr, console, messages);
		};

		// Check for the presence of a logger.
		if (typeof console === "undefined") {
			return function () { /* no console */ };
		}

		return function(messages, context) {
			// Convert arguments object to Array.
			messages = Array.prototype.slice.call(messages);

			var hdlr = console.log;
			var timerLabel;

			if (context.level === Logger.TIME) {
				timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

				if (messages[1] === 'start') {
					if (console.time) {
						console.time(timerLabel);
					}
					else {
						timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
					}
				}
				else {
					if (console.timeEnd) {
						console.timeEnd(timerLabel);
					}
					else {
						invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
							(new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms' ]);
					}
				}
			}
			else {
				// Delegate through to custom warn/error loggers if present on the console.
				if (context.level === Logger.WARN && console.warn) {
					hdlr = console.warn;
				} else if (context.level === Logger.ERROR && console.error) {
					hdlr = console.error;
				} else if (context.level === Logger.INFO && console.info) {
					hdlr = console.info;
				}

				options.formatter(messages, context);
				invokeConsoleMethod(hdlr, messages);
			}
		};
	};

	// Configure and example a Default implementation which writes to the `window.console` (if present).  The
	// `options` hash can be used to configure the default logLevel and provide a custom message formatter.
	Logger.useDefaults = function(options) {
		Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
		Logger.setHandler(Logger.createDefaultHandler(options));
	};

	// Export to popular environments boilerplate.
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (Logger),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Logger;
	}
	else {
		Logger._prevLogger = global.Logger;

		Logger.noConflict = function () {
			global.Logger = Logger._prevLogger;
			return Logger;
		};

		global.Logger = Logger;
	}
}(this));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(extend) {/**
 * @class IntegrationService
 */

(function universalModuleDefinition(root, factory){
    if (true){
        // CommonJS
        module.exports = factory(__webpack_require__(2), __webpack_require__(1), __webpack_require__(7));
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Logger, extend) {/**
 * @class Chat
 */

(function universalModuleDefinition(root, factory){
    if (true){
        // CommonJS
        module.exports = factory(__webpack_require__(3), __webpack_require__(1));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['IntegrationService', 'EventEmitter'], factory);
    } else if (typeof EventEmitter !== 'undefined'){
        // Browser
        root.Connector = factory(IntegrationService, EventEmitter);
    }
}(this, function (IntegrationService, EventEmitter){
    'use strict';
    var logger = Logger.get('Chat');

    IntegrationService.addModule('Chat', extend({}, EventEmitter, {

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Logger, extend) {/**
 * @class Roster
 */

(function universalModuleDefinition(root, factory){
    if (true){
        // CommonJS
        module.exports = factory(__webpack_require__(3), __webpack_require__(1));
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(0)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Logger, extend) {/**
 * @class Telephony
 */

(function universalModuleDefinition(root, factory){
    if (true){
        // CommonJS
        module.exports = factory(__webpack_require__(3), __webpack_require__(1));
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(0)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Logger, extend) {/**
 * @class Connector
 */

(function universalModuleDefinition(root, factory){
    if (true){
        // CommonJS
        module.exports = factory(__webpack_require__(9), __webpack_require__(1));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['ReconnectingWebSocket', 'EventEmitter'], factory);
    } else if (typeof ReconnectingWebSocket !== 'undefined' && typeof ReconnectingWebSocket !== 'undefined'){
        // Browser
        root.Connector = factory(ReconnectingWebSocket, EventEmitter);
    }
}(this, function (ReconnectingWebSocket, EventEmitter){
    'use strict';
    var logger = Logger.get('Connector');

    function Connector(options){
        this.initialize(options);
    }

    extend(Connector.prototype, EventEmitter, {

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

            extend(this._options, options);

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
                message = extend({}, {
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(0)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * entry point
 */

__webpack_require__(5);
__webpack_require__(4);
__webpack_require__(6);

if (true){
    module.exports = __webpack_require__(3);
}else{
    require('IntegrationService');
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// MIT License:
//
// Copyright (c) 2010-2012, Joe Walnes
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * This behaves like a WebSocket in every way, except if it fails to connect,
 * or it gets disconnected, it will repeatedly poll until it successfully connects
 * again.
 *
 * It is API compatible, so when you have:
 *   ws = new WebSocket('ws://....');
 * you can replace with:
 *   ws = new ReconnectingWebSocket('ws://....');
 *
 * The event stream will typically look like:
 *  onconnecting
 *  onopen
 *  onmessage
 *  onmessage
 *  onclose // lost connection
 *  onconnecting
 *  onopen  // sometime later...
 *  onmessage
 *  onmessage
 *  etc...
 *
 * It is API compatible with the standard WebSocket API, apart from the following members:
 *
 * - `bufferedAmount`
 * - `extensions`
 * - `binaryType`
 *
 * Latest version: https://github.com/joewalnes/reconnecting-websocket/
 * - Joe Walnes
 *
 * Syntax
 * ======
 * var socket = new ReconnectingWebSocket(url, protocols, options);
 *
 * Parameters
 * ==========
 * url - The url you are connecting to.
 * protocols - Optional string or array of protocols.
 * options - See below
 *
 * Options
 * =======
 * Options can either be passed upon instantiation or set after instantiation:
 *
 * var socket = new ReconnectingWebSocket(url, null, { debug: true, reconnectInterval: 4000 });
 *
 * or
 *
 * var socket = new ReconnectingWebSocket(url);
 * socket.debug = true;
 * socket.reconnectInterval = 4000;
 *
 * debug
 * - Whether this instance should log debug messages. Accepts true or false. Default: false.
 *
 * automaticOpen
 * - Whether or not the websocket should attempt to connect immediately upon instantiation. The socket can be manually opened or closed at any time using ws.open() and ws.close().
 *
 * reconnectInterval
 * - The number of milliseconds to delay before attempting to reconnect. Accepts integer. Default: 1000.
 *
 * maxReconnectInterval
 * - The maximum number of milliseconds to delay a reconnection attempt. Accepts integer. Default: 30000.
 *
 * reconnectDecay
 * - The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. Accepts integer or float. Default: 1.5.
 *
 * timeoutInterval
 * - The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. Accepts integer. Default: 2000.
 *
 */
(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module !== 'undefined' && module.exports){
        module.exports = factory();
    } else {
        global.ReconnectingWebSocket = factory();
    }
})(this, function () {

    if (!('WebSocket' in window)) {
        return;
    }

    function ReconnectingWebSocket(url, protocols, options) {

        // Default settings
        var settings = {

            /** Whether this instance should log debug messages. */
            debug: false,

            /** Whether or not the websocket should attempt to connect immediately upon instantiation. */
            automaticOpen: true,

            /** The number of milliseconds to delay before attempting to reconnect. */
            reconnectInterval: 1000,
            /** The maximum number of milliseconds to delay a reconnection attempt. */
            maxReconnectInterval: 30000,
            /** The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. */
            reconnectDecay: 1.5,

            /** The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. */
            timeoutInterval: 2000,

            /** The maximum number of reconnection attempts to make. Unlimited if null. */
            maxReconnectAttempts: null
        }
        if (!options) { options = {}; }

        // Overwrite and define settings with options if they exist.
        for (var key in settings) {
            if (typeof options[key] !== 'undefined') {
                this[key] = options[key];
            } else {
                this[key] = settings[key];
            }
        }

        // These should be treated as read-only properties

        /** The URL as resolved by the constructor. This is always an absolute URL. Read only. */
        this.url = url;

        /** The number of attempted reconnects since starting, or the last successful connection. Read only. */
        this.reconnectAttempts = 0;

        /**
         * The current state of the connection.
         * Can be one of: WebSocket.CONNECTING, WebSocket.OPEN, WebSocket.CLOSING, WebSocket.CLOSED
         * Read only.
         */
        this.readyState = WebSocket.CONNECTING;

        /**
         * A string indicating the name of the sub-protocol the server selected; this will be one of
         * the strings specified in the protocols parameter when creating the WebSocket object.
         * Read only.
         */
        this.protocol = null;

        // Private state variables

        var self = this;
        var ws;
        var forcedClose = false;
        var timedOut = false;
        var eventTarget = document.createElement('div');

        // Wire up "on*" properties as event handlers

        eventTarget.addEventListener('open',       function(event) { self.onopen(event); });
        eventTarget.addEventListener('close',      function(event) { self.onclose(event); });
        eventTarget.addEventListener('connecting', function(event) { self.onconnecting(event); });
        eventTarget.addEventListener('message',    function(event) { self.onmessage(event); });
        eventTarget.addEventListener('error',      function(event) { self.onerror(event); });

        // Expose the API required by EventTarget

        this.addEventListener = eventTarget.addEventListener.bind(eventTarget);
        this.removeEventListener = eventTarget.removeEventListener.bind(eventTarget);
        this.dispatchEvent = eventTarget.dispatchEvent.bind(eventTarget);

        /**
         * This function generates an event that is compatible with standard
         * compliant browsers and IE9 - IE11
         *
         * This will prevent the error:
         * Object doesn't support this action
         *
         * http://stackoverflow.com/questions/19345392/why-arent-my-parameters-getting-passed-through-to-a-dispatched-event/19345563#19345563
         * @param s String The name that the event should use
         * @param args Object an optional object that the event will use
         */
        function generateEvent(s, args) {
        	var evt = document.createEvent("CustomEvent");
        	evt.initCustomEvent(s, false, false, args);
        	return evt;
        };

        this.open = function (reconnectAttempt) {
            ws = new WebSocket(self.url, protocols || []);

            if (reconnectAttempt) {
                if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
                    return;
                }
            } else {
                eventTarget.dispatchEvent(generateEvent('connecting'));
                this.reconnectAttempts = 0;
            }

            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.debug('ReconnectingWebSocket', 'attempt-connect', self.url);
            }

            var localWs = ws;
            var timeout = setTimeout(function() {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'connection-timeout', self.url);
                }
                timedOut = true;
                localWs.close();
                timedOut = false;
            }, self.timeoutInterval);

            ws.onopen = function(event) {
                clearTimeout(timeout);
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onopen', self.url);
                }
                self.protocol = ws.protocol;
                self.readyState = WebSocket.OPEN;
                self.reconnectAttempts = 0;
                var e = generateEvent('open');
                e.isReconnect = reconnectAttempt;
                reconnectAttempt = false;
                eventTarget.dispatchEvent(e);
            };

            ws.onclose = function(event) {
                clearTimeout(timeout);
                ws = null;
                if (forcedClose) {
                    self.readyState = WebSocket.CLOSED;
                    eventTarget.dispatchEvent(generateEvent('close'));
                } else {
                    self.readyState = WebSocket.CONNECTING;
                    var e = generateEvent('connecting');
                    e.code = event.code;
                    e.reason = event.reason;
                    e.wasClean = event.wasClean;
                    eventTarget.dispatchEvent(e);
                    if (!reconnectAttempt && !timedOut) {
                        if (self.debug || ReconnectingWebSocket.debugAll) {
                            console.debug('ReconnectingWebSocket', 'onclose', self.url);
                        }
                        eventTarget.dispatchEvent(generateEvent('close'));
                    }

                    var timeout = self.reconnectInterval * Math.pow(self.reconnectDecay, self.reconnectAttempts);
                    setTimeout(function() {
                        self.reconnectAttempts++;
                        self.open(true);
                    }, timeout > self.maxReconnectInterval ? self.maxReconnectInterval : timeout);
                }
            };
            ws.onmessage = function(event) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onmessage', self.url, event.data);
                }
                var e = generateEvent('message');
                e.data = event.data;
                eventTarget.dispatchEvent(e);
            };
            ws.onerror = function(event) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onerror', self.url, event);
                }
                eventTarget.dispatchEvent(generateEvent('error'));
            };
        }

        // Whether or not to create a websocket upon instantiation
        if (this.automaticOpen == true) {
            this.open(false);
        }

        /**
         * Transmits data to the server over the WebSocket connection.
         *
         * @param data a text string, ArrayBuffer or Blob to send to the server.
         */
        this.send = function(data) {
            if (ws) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'send', self.url, data);
                }
                return ws.send(data);
            } else {
                throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
            }
        };

        /**
         * Closes the WebSocket connection or connection attempt, if any.
         * If the connection is already CLOSED, this method does nothing.
         */
        this.close = function(code, reason) {
            // Default CLOSE_NORMAL code
            if (typeof code == 'undefined') {
                code = 1000;
            }
            forcedClose = true;
            if (ws) {
                ws.close(code, reason);
            }
        };

        /**
         * Additional public API method to refresh the connection if still open (close, re-open).
         * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
         */
        this.refresh = function() {
            if (ws) {
                ws.close();
            }
        };
    }

    /**
     * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
     * this indicates that the connection is ready to send and receive data.
     */
    ReconnectingWebSocket.prototype.onopen = function(event) {};
    /** An event listener to be called when the WebSocket connection's readyState changes to CLOSED. */
    ReconnectingWebSocket.prototype.onclose = function(event) {};
    /** An event listener to be called when a connection begins being attempted. */
    ReconnectingWebSocket.prototype.onconnecting = function(event) {};
    /** An event listener to be called when a message is received from the server. */
    ReconnectingWebSocket.prototype.onmessage = function(event) {};
    /** An event listener to be called when an error occurs. */
    ReconnectingWebSocket.prototype.onerror = function(event) {};

    /**
     * Whether all instances of ReconnectingWebSocket should log debug messages.
     * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
     */
    ReconnectingWebSocket.debugAll = false;

    ReconnectingWebSocket.CONNECTING = WebSocket.CONNECTING;
    ReconnectingWebSocket.OPEN = WebSocket.OPEN;
    ReconnectingWebSocket.CLOSING = WebSocket.CLOSING;
    ReconnectingWebSocket.CLOSED = WebSocket.CLOSED;

    return ReconnectingWebSocket;
});


/***/ })
/******/ ]);
});
//# sourceMappingURL=Wildix.IntegrationService.js.map