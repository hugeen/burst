var slice = Array.prototype.slice;
var eventCapabilities = require('./event');

module.exports = function (object) {

    if ('observe' in object) {
        return object;
    }

    eventCapabilities(object);
    defineObservedProperties(object);

    object.subscribe = subscribe;
    object.unsubscribe = unsubscribe;

    return object;

};


function defineObservedProperties (object) {
    Object.defineProperty(object, 'observedProperties', {
        value: {}
    });
}


function subscribe (property) {
    if (!(property in this.observedProperties) || !this.observedProperties[property]) {
        this.observedProperties[property] = true;

        Object.defineProperty(this, property, {
            set: function (newValue) {
                this.emit(property + ' changed', newValue);
                return newValue;
            }
        });
    }
}

function unsubscribe (property) {
    this.observedProperties[property] = false;

    Object.defineProperty(this, property, {
        set: function (newValue) {
            return newValue;
        }
    });
}
