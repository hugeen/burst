import {globalOn, globalRemoveListener} from '../core/event';
import {invoke, isElementOrElementList} from './utils';
import eventsMap from './events_map';


export var eventsEnabled = false;


export function enableDomEvents () {
    if (!eventsEnabled) {
        globalOn('listener added', addDomListener);
        globalOn('listener removed', removeDomListener);
        eventsEnabled = true;
    }
};


export function disableDomEvents () {
    if (eventsEnabled) {
        globalRemoveListener('listener added', addDomListener);
        globalRemoveListener('listener removed', removeDomListener);
        eventsEnabled = false;
    }
};


export function addDomListener (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        invoke(object, 'addEventListener', eventsMap[identifier]|| identifier, listener);
    }
};


export function removeDomListener (object, identifier, listener) {
    if (isElementOrElementList(object)) {
        invoke(object, 'removeEventListener', eventsMap[identifier]|| identifier, listener);
    }
};


export function domReady (callback) {
    var ready = document.readyState === 'complete';

    if (ready) {
        callback();
    } else {
        addDomListener(document, 'dom loaded', callback);
    }

    return ready;
};
