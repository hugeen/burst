import {castElements, castElement, setProperty} from './utils';


export function hide (elements) {
    castElements(elements).forEach(element => element.style.display = 'none');
}


export function show (elements) {
    castElements(elements).forEach(element => element.style.display = '');
}


export function addClass (elements, className) {
    castElements(elements).forEach(element => element.classList.add(className));
}


export function removeClass (elements, className) {
    castElements(elements).forEach(element => element.classList.remove(className));
}


export function toggleClass (elements, className) {
    castElements(elements).forEach(element => element.classList.toggle(className));
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
    castElements(elements).forEach(element => element.parentNode.removeChild(element));
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
