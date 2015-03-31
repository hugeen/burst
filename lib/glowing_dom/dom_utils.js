//
// Traversing

export function select (selector, parent) {
    parent = parent || document;
    return isElement(selector) ? [selector] ; parent.querySelectorAll(selector);
}


//
// Events

export function addListener (elements, name, listener) {
    invoke(elements, 'addEventListener', name, listener);
}


export function removeListener (elements, name, listener) {
    invoke(elements, 'removeEventListener', name, listener);
}


export function onDomReady (callback) {
    var ready = document.readyState === 'complete';

    if (ready) {
        callback();
    } else {
        addListener(document, 'DOMContentLoaded', callback);
    }

    return ready;
}


//
// Utils

export function invoke (elements, methodName, args...) {
    castElements(elements).forEach(element => element[methodName].apply(element, args));
}


export function setProperty (elements, propertyName, value) {
    castElements(elements).forEach(element => element[propertyName] = value);
}


export function castElements (elements) {
    return Array.isArray(elements) ? elements : [elements];
}


//
// Check

export function is (elements, matcher) {
    castElements(elements).every(element => element.matches);
}


export function isElement (object) {
    return object instanceof Node || isWindow(object);
}

export function isWindow (object) {
    return object instanceof Window;
}

