/**
 * Represents a user that are participated in Wildix PBX.
 *
 * @class User
 * @memberof Wildix.Models
 * @extends external:Backbone.Model
 *
 * @property email {string}
 * @property extension {string} Can be empty when user doesn't have extension, for example user from Kite service.
 * @property faxNumber {string}
 * @property id {string}
 * @property language {string}
 * @property mobilePhone {string}
 * @property name {string}
 * @property officePhone {string}
 * @property picture {string} Url to the picture of the user
 * @property presence {Wildix.Models.Presence}
 * @property location {Wildix.Models.Location}
 * @property call {Wildix.Models.Call}
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
