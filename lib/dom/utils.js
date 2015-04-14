export function toElementList (polymorph) {
    return Array.isArray(polymorph) ? polymorph : [polymorph];
};


export function toElement (polymorph) {
    return Array.isArray(polymorph) && polymorph.length ? polymorph[0] : polymorph;
};


export function eachElement (elements, iterator) {
    toElementList(elements).forEach(element => iterator(element));
};


export function invoke (elements, methodName, ...args) {
    eachElement(elements, element => element[methodName].apply(element, args));
};


export function setProperty (elements, propertyName, value) {
    eachElement(elements, element => element[propertyName] = value);
};


export function is (elements, matcher) {
    return toElementList(elements).every(element => element.matches(matcher));
};


export function isElement (object) {
    return object instanceof Node || isWindow(object);
};


export function isWindow (object) {
    return object instanceof Window;
};


export function isNodeList (object) {
    return object instanceof NodeList
};


export function isElementList (object) {
    return isNodeList(object) || (Array.isArray(object) && object.every(item => isElement(item)));
};


export function isElementOrElementList (object) {
    return isElement(object) || isElementList(object);
};

