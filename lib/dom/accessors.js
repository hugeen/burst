import {eachElement, toElement} from './utils';


export function getStyle (element, property) {
    return getStyles(element)[property];
};


export function getStyles (element) {
    return getComputedStyle(toElement(element));
};


export function setStyle (elements, property, value) {
    eachElement(elements, element => element.style[property] = value);
};


export function setStyles (elements, style) {
    eachElement(elements, element => Object.assign(element.style, style));
};


export function getAttribute (element, attribute) {
    return toElement(element).getAttribute(attribute);
};


export function setAttribute (elements, attribute, value) {
    eachElement(elements, element => element.setAttribute(attribute, value));
};


export function setAttributes (elements, object) {
    for (var attribute in object) {
        setAttribute(elements, attribute, object[attribute]);
    }
};
