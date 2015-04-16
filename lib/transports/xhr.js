import {on, emit} from '../core/event';


export var xhrEventsMap = {
    'loading': 'load start',
    'timeout': 'timeout',
    'progress': 'progress',
    'load': 'load',
    'loaded': 'loadend',
    'error': 'error',
    'abort': 'abord'
};


export function buildXhr () {
    var xhr = new XMLHttpRequest();
    proxifyXhrEvents(xhr);

    return xhr;
};


export function proxifyXhrEvents (xhr) {
    for (var eventName in xhrEventsMap) {
        proxifyXhrEvent(xhr, eventName, xhrEventsMap[eventName]);
    }
};


export function proxifyXhrEvent (xhr, eventName, prettyEventName) {
    xhr.addEventListener(eventName, (...args) => emit(xhr, prettyEventName || eventName, ...args), false);
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
