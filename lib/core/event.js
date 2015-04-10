var listenableMap = new WeakMap();


export function getListenable (object) {
    if (!listenableMap.has(object)) {
        listenableMap.set(object, {});
    }

    return listenableMap.get(object);
};


export function getListeners (object, identifier) {
    var listenable = getListenable(object);
    listenable[identifier] = listenable[identifier] || [];

    return listenable[identifier];
};


export function on (object, identifier, listener) {
    var listeners = getListeners(object, identifier);

    listeners.push(listener);
};


export function removeListener (object, identifier, listener) {
    var listeners = getListeners(object, identifier);

    var index = listeners.indexOf(listener);
    if(index !== -1) {
        listeners.splice(index, 1);
    }
};


export function emit (object, identifier, ...args) {
    var listeners = getListeners(object, identifier);

    for (var listener of listeners) {
        listener.apply(object, args);
    }
};
