/**
 * Represents a presence of a User.<br />
 * Used in user model and can be received from {@link Wildix.Models.User}.
 *
 * @class Presence
 * @memberof Wildix.Models
 * @extends external:Backbone.Model
 *
 * @property type {string} Type status
 *                        <ul>
 *                            <li>available</li>
 *                            <li>unavailable</li>
 *                        </ul>
 * @property show {string} Main status
 *                              <ul>
 *                                  <li>available</li>
 *                                  <li>dnd</li>
 *                                  <li>away</li>
 *                                  <li>mur</li>
 *                              </ul>
 * @property status {string} Status message.
 * @property deviceShow {string} Device state
 *                              <ul>
 *                                  <li>ringing</li>
 *                                  <li>talking</li>
 *                                  <li>rt</li>
 *                                  <li>registered</li>
 *                              </ul>
 * @property until {string} Expire date - a date when this presence are valid.
 * @example
 * user.get('presence').get(property)
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
        root.Models.Presence = factory(root.Backbone);
    }
}(this, function (Backbone){
    'use strict';
    var logger = Logger.get('Presence');

    return Backbone.Model.extend({
        defaults: {
            type: 'unavailable', // available || unavailable
            show: '',  // dnd || away || available
            status: '',
            deviceShow: '', // ringing || talking || rt
            until: '' // Date
        },

        initialize: function() {
            logger.info('initialize');
        },

        isAvailable: function(){
            if(this.get('type') == 'available'){
                return true;
            }
            return false;
        },

        isUnavailable: function(){
            if(this.get('type') == 'unavailable'){
                return true;
            }
            return false;
        },

        getFormattedUntil: function(){
            if(this.get('until') && this.get('until') != ''){
                return this.get('until').format('dd/mm/yyyy HH:MM');
            }
            return '';
        }
    });
}));
