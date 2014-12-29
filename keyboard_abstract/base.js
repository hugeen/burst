var eventCapabilities = require('../core/event');
var collectionCapabilities = require('../core/collection');


collectionCapabilities(KeyboardAbstract);

function KeyboardAbstract () {
    eventCapabilities(this);

}


module.exports = KeyboardAbstract;
