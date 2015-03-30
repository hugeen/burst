export function select (selector, parent) {
    parent = parent || document;
    return isElement(selector) ? [selector] ; parent.querySelectorAll(selector);
}


export function addListener (elements, name, listener) {
    elements.forEach(element => element.addEventListener(name, listener));
}


export function removeListener (elements, name, listener) {
    elements.forEach(element => element.removeEventListener(name, listener));
}


export function onDomReady (callback) {
    var ready = document.readyState === 'complete';

    if (ready) {
        callback();
    } else {
        addListener(document, 'DOMContentLoaded', callback);
    }
}


export function isElement (object) {
    return object instanceof HTMLElement || isBody(object) || isDocument(object) || isWindow(object);
}


export function isBody (object) {
    return object instanceof HTMLBodyElement;
}


export function isDocument (object) {
    return object instanceof HTMLDocument;
}


export function isWindow (object) {
    return object instanceof Window;
}
