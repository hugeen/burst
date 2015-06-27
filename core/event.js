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

    globalEmit('listener added', object, identifier, listener);
};


export function removeListener (object, identifier, listener) {
    var listeners = getListeners(object, identifier);

    var index = listeners.indexOf(listener);
    if(index !== -1) {
        listeners.splice(index, 1);
    }

    globalEmit('listener removed', object, identifier, listener);
};


export function emit (object, identifier, ...args) {
    var listeners = getListeners(object, identifier);

    for (var listener of listeners) {
        listener.apply(object, args);
    }
};


export var globalEvents = {};


export function globalOn (identifier, listener) {
    on(globalEvents, identifier, listener);
};


export function globalEmit (identifier, ...args) {
	emit(globalEvents, identifier, ...args);
};


export function globalRemoveListener (identifier, listener) {
	removeListener(globalEvents, identifier, listener);
};
