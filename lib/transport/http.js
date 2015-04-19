import {on, emit} from '../core/event';


export var eventsMap = {
    'loading': 'load start',
    'timeout': 'timeout',
    'progress': 'progress',
    'load': 'load',
    'load end': 'loadend',
    'error': 'error',
    'abort': 'abord'
};


export function buildRequest () {
    var request = new XMLHttpRequest();
    proxifyEvents(request);

    return request;
};


export function proxifyEvents (request) {
    for (var eventName in eventsMap) {
        proxifyEvent(request, eventName, eventsMap[eventName]);
    }
};


export function proxifyEvent (request, identifier, prettyIdentifier) {
    prettyIdentifier = prettyIdentifier || identifier;
    request.addEventListener(identifier, (...args) => emit(request, prettyIdentifier, ...args), false);
};


export function buildGet (url) {
    var request = buildRequest();
    request.open('GET', url, true);

    return request;
};


export function buildPost (url) {
    var request = buildRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    return request;
};


export function setDefaultCallbacks (request, loadCallback, errorCallback) {
    if (loadCallback) { on(request, 'load', loadCallback); }
    if (errorCallback) { on(request, 'error', errorCallback); }
};


export function get (url, loadCallback, errorCallback) {
    var request = buildGet(url);
    setDefaultCallbacks(request, loadCallback, errorCallback);
    request.send();

    return request;
};


export function post (url, data, loadCallback, errorCallback) {
    var request = buildGet(url);
    setDefaultCallbacks(request, loadCallback, errorCallback);
    request.send(data);

    return request;
};
