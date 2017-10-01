/**
 * @class User
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(
                require('underscore'), require('backbone'),
                require('Models/Presence'), require('Models/Location'),
                require('Models/Call')
        );
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['underscore', 'backbone', 'Models/Presence', 'Models/Location', 'Models/Call'], factory);
    } else {
        // Browser
        root.Models = root.Models || {};
        root.Models.User = factory(
                root.underscore,
                root.Backbone,
                root.Models.Presence,
                root.Models.Location,
                root.Models.Call
        );
    }
}(this, function (_, Backbone, Presence, Location, Call){
    'use strict';
    var logger = Logger.get('User');

    var User = Backbone.Model.extend({

        composite: {
            presence: Presence,
            call: Call,
            location: Location
        },

        defaults: {
            email: '',
            extension: '',
            faxNumber: '',
            id: '',
            language: '',
            mobilePhone: '',
            name: '',
            officePhone: '',
            picture: '',
            presence: null,
            location: null,
            call: null
        },

        idAttribute: 'id',

        initialize: function(data, options) {
            logger.info('initialize');

            this.makeComposite(options);
        }
    });

    Backbone.mixinCompositeModel(User.prototype);

    return User;
}));
