/**
 * @class Presence
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
