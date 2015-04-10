import {emit} from '../core/event';


export var xhrEvents = ['loadstart', 'timeout', 'progress', 'load', 'loadend', 'error', 'abort'];


export function buildXhr () {
    var xhr = new XMLHttpRequest();
    proxifyXhrEvents(xhr, xhrEvents);

    return xhr;
};


export function proxifyXhrEvents (xhr, eventNames) {
    eventNames.forEach(eventName => proxifyXhrEvent(xhr, eventName));
};


export function proxifyXhrEvent (xhr, eventName) {
    xhr.addEventListener(eventName, (...args) => emit(xhr, eventName, ...args), false);
};


export function get (url, configure) {
    var xhr = buildXhr();
    xhr.open('GET', url, true);

    if (configure) {
        configure(xhr);
    }

    xhr.send();
    return xhr;
};


export function post (url, data, configure) {
    var xhr = buildXhr();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    if (configure) {
        configure(xhr);
    }

    xhr.send(data)

    return xhr;
};
