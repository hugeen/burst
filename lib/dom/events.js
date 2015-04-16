import {globalOn, globalRemoveListener, on} from '../core/event';
import {invoke, isElementOrElementList} from './utils';
import eventsMap from './events_map';


export var eventsEnabled = false;


export function enableDomEvents () {
    if (!eventsEnabled) {
        globalOn('listener added', addListenerProxy);
        globalOn('listener removed', removeListenerProxy);
        eventsEnabled = true;
    }
};


export function disableDomEvents () {
    if (eventsEnabled) {
        globalRemoveListener('listener added', addListenerProxy);
        globalRemoveListener('listener removed', removeListenerProxy);
        eventsEnabled = false;
    }
};


export function addListenerProxy (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        addDomListener(object, identifier, listener);
    }
};


export function removeListenerProxy (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        removeDomListener(object, identifier, listener);
    }
};


export function addDomListener (object, identifier, listener) {
    invoke(object, 'addEventListener', identifier, listener);
};


export function removeDomListener (object, identifier, listener) {
    invoke(object, 'removeEventListener', identifier, listener);
};


export function domReady (callback) {
    var ready = document.readyState === 'complete';

    if (ready) {
        callback();
    } else {
        addDomListener(document, 'DOMContentLoaded', callback);
    }

    return ready;
};
