/**
 * idea from https://github.com/prantlf/backbone.composite-model
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('underscore'), require('backbone'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['underscore', 'backbone'], factory);
    } else {
        // Browser
        factory(root.underscore, root.Backbone);
    }
}(this, function (_, Backbone){
    'use strict';

    Backbone.mixinCompositeModel = function (prototype) {
        var originalSet = prototype.set;
        var originalToJSON = prototype.toJSON;

        return _.extend(prototype, {

            makeComposite: function (options) {
                for(var property in this.composite){
                    this.get(property).on('all', this._triggerChildEvent.bind(this, property), this);
                }
            },

            // Overriding set
            set: function(attributes, options) {
                for(var property in this.composite){
                    if(attributes[property]){
                        var propertyModel = this.get(property);
                        if(propertyModel){
                            propertyModel.set(attributes[property], options);
                            delete attributes[property];
                        }else{
                            attributes[property] = new this.composite[property](attributes[property]);
                        }
                    }
                }

                return originalSet.call(this, attributes, options);
            },

            _triggerChildEvent: function(){
                var property = arguments[0];
                var args = Array.from(arguments);
                args = args.slice(1);

                args[0] = args[0].split(':');
                args[0].splice(1, 0, property);
                args[0] = args[0].join(':');

                args.splice(1, 0, this);
                this.trigger.apply(this, args);
                if(arguments[1] == 'change'){
                    this.trigger('change', this, args[args.length - 1]);
                }
            },

            // Overrides the `Backbone.Model:toJSON()` method to ensure that the
            // up-to-date nested attribute values will be present in the result
            toJSON: function(options) {
                var result = originalToJSON.call(this, options);
                for(var property in this.composite){
                    var child = this.get(property);
                    if (child) {
                        result[property] = child.toJSON();
                    }
                }
                return result;
            }
        });
    };

    return Backbone.mixinCompositeModel;
}));
