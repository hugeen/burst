import {invoke} from './utils';


export function addListener (elements, name, listener) {
    invoke(elements, 'addEventListener', name, listener);
};


export function removeListener (elements, name, listener) {
    invoke(elements, 'removeEventListener', name, listener);
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
