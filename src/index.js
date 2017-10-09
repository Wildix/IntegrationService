/**
 * The Backbone namespace.
 *
 *
 * @external Backbone
 * @see {@link http://backbonejs.org/|Backbone}
 */

/**
 * The Backbone collection class.
 *
 * @class Collection
 * @memberof external:Backbone
 * @see {@link http://backbonejs.org/#Collection|Backbone.Collection}
 */

/**
 * The Backbone model class.
 *
 * @class Model
 * @memberof external:Backbone
 * @see {@link http://backbonejs.org/#Model|Backbone.Model}
 */

/**
 * The Backbone events class.
 *
 * @class Events
 * @memberof external:Backbone
 * @see {@link http://backbonejs.org/#Events|Backbone.Events}
 */

/**
 * The Wildix namespace.
 *
 * @namespace Wildix
 */

/**
 * The Models namespace.
 *
 * @namespace Models
 * @memberof Wildix
 */

require('plugins/backbone.mixinCompositeModel');

require('Roster');
require('Chat');
require('Telephony');

if (typeof exports == 'object'){
    module.exports = require('IntegrationService');
}else{
    require('IntegrationService');
}
