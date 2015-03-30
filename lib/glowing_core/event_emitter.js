
var listenableMap = new WeakMap();


export function getListenable (object) {
    if (listenableMap.has(object)) {
        listenableMap.add({});
    }

    return listenableMap.get(object);
}


export function getListeners (listenable, identifier) {
    listenable[identifier] = listenable[identifier] || [];

    return listenable[identifier];
}


export function on (object, identifier, listener) {
    var listenable = getListenable(object);
    var listeners = getListeners(listenable);

    listeners.push(listener);
}

export function removeListener (object, identifier, listener) {
    var listenable = getListenable(object);
    var listeners = getListeners(listenable);

    if (identifier in listeners) {
        var listener = listeners[identifier];
        listener.splice(listener.indexOf(listener), 1);
    }
}


export function emit (object, identifier, ...args) {
    var listenable = getListenable(object);
    var listeners = getListeners(listenable);

    if (identifier in listeners) {
        for (var listener of listeners[identifier]) {
            listener.apply(listenable, args);
        }
    }
}
