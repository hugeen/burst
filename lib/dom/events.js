import {globalOn, globalRemoveListener, on} from '../core/event';
import {invoke, isElementOrElementList} from './utils';
import eventsMap from './events_map';


export var eventsEnabled = false;


export function enableDomEvents () {
    if (!eventsEnabled) {
        globalOn('listener added', listenerProxy);
        eventsEnabled = true;
    }
};


export function disableDomEvents () {
    if (eventsEnabled) {
        globalRemoveListener('listener removed', listenerProxy);
        eventsEnabled = false;
    }
};


export function listenerProxy (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        console.log(object, identifier, listener);
    }
};


export function addListener (object, identifier, listener) {
    invoke(object, 'addEventListener', identifier, listener);
};


export function removeListener (object, identifier, listener) {
    invoke(object, 'removeEventListener', identifier, listener);
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
