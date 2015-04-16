import {invoke, isElementOrElementList} from './utils';
import eventsMap from './events_map';

var proxyMap = new WeakMap();


export function getProxy (object) {
    if (!proxyMap.has(object)) {
        proxyMap.set(object, {});
    }

    return proxyMap.get(object);
};


export function getProxyListener (object, identifier, listener) {
    var proxy = getProxy(object);

};


export function proxifyEvents () {
    on('listener added', addEventProxy);
    on('listener removed', removeEventProxy);
};


export function addEventProxy (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        addListener(object, identifier, function (...args) {
            emit(object, identifier, ...args);
        });
    }
};


export function removeEventProxy (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        removeListener(object, identifier, fixme);
    }
};


export function addListener (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        invoke(object, 'addEventListener', identifier, listener);
    }
};


export function removeListener (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        invoke(object, 'removeEventListener', identifier, listener);
    }
};


export function domReady (callback) {
    var ready = document.readyState === 'complete';

    if (ready) {
        callback();
    } else {
        addListener(document, 'DOMContentLoaded', callback);
    }

    return ready;
};
