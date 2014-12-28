var eventCapabilities = require('../core/event');
var collectionCapabilities = require('../core/collection');


collectionCapabilities(KeyboardManager);

function KeyboardManager () {
    eventCapabilities(this);
}


module.exports = KeyboardManager;
