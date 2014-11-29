var slice = Array.prototype.slice;


module.exports = function (object) {

    if ('on' in object) {
        return object;
    }


    var properties = {
        on: on,
        emit: emit,
        removeListener: removeListener,
        logEvent: logEvent
    };

    for (var name in properties) {
        Object.defineProperty(object, name, {
            value: properties[name]
        });
    }


    return object;

};


function on (identifier, fnc) {
    findOrCreateListeners.call(this);

    this.listeners[identifier] = this.listeners[identifier] || [];
    this.listeners[identifier].push(fnc);

    return this;
}


function removeListener (identifier, fnc) {
    findOrCreateListeners.call(this);

    if (identifier in this.listeners) {
        this.listeners[identifier].splice(this.listeners[identifier].indexOf(fnc), 1);
    }

    return this;
}


function emit (identifier, fnc) {
    findOrCreateListeners.call(this);

    if (identifier in this.listeners) {
        for (var i = 0; i < this.listeners[identifier].length; i++) {
            this.listeners[identifier][i].apply(this, slice.call(arguments, 1));
        }
    }

    return this;
}


function logEvent (eventName) {
    this.on(eventName, function() {
        console.log.apply(null, [eventName].concat(slice.call(arguments)));
    });
}


function findOrCreateListeners () {
    if (!('listeners' in this)) {
        Object.defineProperty(this, 'listeners', {
            value: {}
        });
    }
}
