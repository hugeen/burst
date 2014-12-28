var slice = Array.prototype.slice;
var eventCapabilities = require('./event');

module.exports = function(object) {

    if ('subscribe' in object) {
        return object;
    }

    eventCapabilities(object);
    defineObservedProperties(object);

    object.subscribe = subscribe;
    object.unsubscribe = unsubscribe;

    return object;

};


function defineObservedProperties(object) {
    Object.defineProperty(object, 'observedProperties', {
        value: {}
    });
}


function subscribe(property) {
    if (!(property in this.observedProperties)) {
        this.observedProperties[property] = new Date.getTime();

        overrideSetter(this, property, function setterWithNotification(newValue) {
            this.emit(property + ' changed', newValue);
            return newValue;
        });
    }
}


function unsubscribe(property) {
    delete this.observedProperties[property];

    overrideSetter(this, property, function setterWithoutNotification(newValue) {
        return newValue;
    });
}


function overrideSetter(object, property, setter) {
    Object.defineProperty(object, property, {
        set: setter
    });
}
