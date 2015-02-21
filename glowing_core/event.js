export default eventAbilities;


function eventAbilities (object) {

    if ('on' in object) {
        return object;
    }

    defineListeners(object);

    object.on = on;
    object.emit = emit;
    object.removeListener = removeListener;

    return object;

}


function defineListeners (object) {
    Object.defineProperty(object, 'listeners', {
        value: {},
        configurable: false,
        enumerable: false
    });
}


function on (identifier, fnc) {
    this.listeners[identifier] = this.listeners[identifier] || [];
    this.listeners[identifier].push(fnc);
}


function emit (identifier, fnc) {
    if (identifier in this.listeners) {
        for (var i = 0; i < this.listeners[identifier].length; i++) {
            var listener = this.listeners[identifier];
            listener[i].apply(this, [].slice.call(arguments, 1));
        }
    }
}


function removeListener (identifier, fnc) {
    if (identifier in this.listeners) {
        var listener = this.listeners[identifier];
        listener.splice(listener.indexOf(fnc), 1);
    }
}
