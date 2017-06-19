/*
 * entry point
 */

require('Roster');
require('Chat');
require('Telephony');

if (typeof exports == 'object'){
    module.exports = require('IntegrationService');
}else{
    require('IntegrationService');
}
