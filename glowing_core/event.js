export default eventAbilities;


function eventAbilities (object) {

    if ('on' in object) {
        return object;
    }

    defineListeners(object);
    Object.assign(object, {on, emit, removeListener});

    return object;

}


function defineListeners (object) {
    Object.defineProperty(object, 'listeners', {
        value: {}
    });
}


function on (identifier, fnc) {
    this.listeners[identifier] = this.listeners[identifier] || [];
    this.listeners[identifier].push(fnc);
}


function emit (identifier, ...args) {
    if (identifier in this.listeners) {
        for (var listener of this.listeners[identifier]) {
            listener.apply(this, args);
        }
    }
}


function removeListener (identifier, fnc) {
    if (identifier in this.listeners) {
        var listener = this.listeners[identifier];
        listener.splice(listener.indexOf(fnc), 1);
    }
}
