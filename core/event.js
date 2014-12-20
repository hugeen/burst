var slice = Array.prototype.slice;


module.exports = function (object) {

    if ('on' in object) {
        return object;
    }


    defineCapabilities.call(this, {
        listeners: {},
        on: on,
        emit: emit,
        removeListener: removeListener
    });


    return object;

};


function defineCapabilities (capabilities) {
    for (var name in capabilities) {
        Object.defineProperty(this, name, {
            value: capabilities[name]
        });
    }
}


function on (identifier, fnc) {
    this.listeners[identifier] = this.listeners[identifier] || [];
    this.listeners[identifier].push(fnc);
}


function removeListener (identifier, fnc) {
    if (identifier in this.listeners) {
        var listener = this.listeners[identifier];
        listener.splice(listeners.indexOf(fnc), 1);
    }
}


function emit (identifier, fnc) {
    if (identifier in this.listeners) {
        for (var i = 0; i < this.listeners[identifier].length; i++) {
            var listener = this.listeners[identifier];
            listener[i].apply(this, slice.call(arguments, 1));
        }
    }
}
