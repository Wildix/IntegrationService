/*
 * entry point
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
