/**
 * Represents a geographic location of User.<br />
 * Used in user model and can be received from {@link Wildix.Models.User}.
 *
 * @class Location
 * @memberof Wildix.Models
 * @extends external:Backbone.Model
 *
 * @property address {string} Address of this location
 * @property lat {string} Latitude in degrees
 * @property lng {string} Longitude in degrees
 * @example
 * user.get('location').get(property)
 */

(function universalModuleDefinition(root, factory){
    if (typeof exports == 'object'){
        // CommonJS
        module.exports = factory(require('backbone'));
    } else if (typeof define == 'function' && define.amd){
        // AMD
        define(['backbone'], factory);
    } else {
        // Browser
        root.Models = root.Models || {};
        root.Models.Location = factory(root.Backbone);
    }
}(this, function (Backbone){
    'use strict';

    var logger = Logger.get('Location');

    return Backbone.Model.extend({
        defaults: {
            address: '',
            lat: '',
            lng: ''
        },
        initialize: function() {
            logger.info('initialize');
        }
    });
}));
