import {castElements, eachElement, castElement, setProperty} from './utils';


export function hide (elements) {
    eachElement(elements, element => element.style.display = 'none');
}


export function show (elements) {
    eachElement(elements, element => element.style.display = '');
}


export function addClass (elements, className) {
    eachElement(elements, element => element.classList.add(className));
}


export function removeClass (elements, className) {
    eachElement(elements, element => element.classList.remove(className));
}


export function toggleClass (elements, className) {
    eachElement(elements, element => element.classList.toggle(className));
}


export function hasClass (elements, className) {
    return castElements(elements).every(element => element.classList.contains(className));
}


export function append (parents, element) {
    castElements(parents).forEach(parent => parent.appendChild(element));
}


export function prepend (parents, element) {
    castElements(parents).forEach(parent => parent.insertBefore(element, parent.firstChild));
}


export function remove (elements) {
    eachElement(elements, element => element.parentNode.removeChild(element));
}


export function empty (elements) {
    setProperty(elements, 'innerHTML', '');
}


export function getStyle (element, property) {
    return getStyles(element)[property];
}


export function getStyles (element) {
    return getComputedStyle(castElement(element));
}


export function setStyle (elements, property, value) {
    eachElement(elements, element => element.style[property] = value);
}


export function setStyles (elements, style) {
    eachElement(elements, element => Object.assign(element.style, style));
}


export function getAttribute (element, attribute) {
    return castElement(element).getAttribute(attribute);
}


export function setAttribute (elements, attribute, value) {
    eachElement(elements, element => element.setAttribute(attribute, value));
}


export function setAttributes (elements, object) {
    for (var attribute in object) {
        setAttribute(elements, attribute, object[attribute]);
    }
}
