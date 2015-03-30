
var listenableMap = new WeakMap();


export function getListenable (object) {
    if (!listenableMap.has(object)) {
        listenableMap.set(object, {});
    }

    return listenableMap.get(object);
}


export function getListeners (listenable, identifier) {
    listenable[identifier] = listenable[identifier] || [];

    return listenable[identifier];
}


export function on (object, identifier, listener) {
    var listenable = getListenable(object);
    var listeners = getListeners(listenable, identifier);

    listeners.push(listener);
}

export function removeListener (object, identifier, listener) {
    var listenable = getListenable(object);
    var listeners = getListeners(listenable, identifier);

    listeners.splice(listeners.indexOf(listener), 1);
}


export function emit (object, identifier, ...args) {
    var listenable = getListenable(object);
    var listeners = getListeners(listenable, identifier);

    for (var listener of listeners) {
        listener.apply(listenable, args);
    }
}
