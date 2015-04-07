export function castElements (elements) {
    return Array.isArray(elements) ? elements : [elements];
}


export function castElement (element) {
    return Array.isArray(element) && element.length ? element[0] : element;
}


export function invoke (elements, methodName, ...args) {
    castElements(elements).forEach(element => element[methodName].apply(element, args));
}


export function setProperty (elements, propertyName, value) {
    castElements(elements).forEach(element => element[propertyName] = value);
}


export function is (elements, matcher) {
    return castElements(elements).every(element => element.matches(matcher));
}


export function isElement (object) {
    return object instanceof Node || isWindow(object);
}


export function isWindow (object) {
    return object instanceof Window;
}
