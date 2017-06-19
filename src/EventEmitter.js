/**
 * @class EventEmitter
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
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
