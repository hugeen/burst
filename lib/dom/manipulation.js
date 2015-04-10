import {castElements, eachElement, setProperty} from './utils';


export function hide (elements) {
    eachElement(elements, element => element.style.display = 'none');
};


export function show (elements) {
    eachElement(elements, element => element.style.display = '');
};


export function addClass (elements, className) {
    eachElement(elements, element => element.classList.add(className));
};


export function removeClass (elements, className) {
    eachElement(elements, element => element.classList.remove(className));
};


export function toggleClass (elements, className) {
    eachElement(elements, element => element.classList.toggle(className));
};


export function hasClass (elements, className) {
    return castElements(elements).every(element => element.classList.contains(className));
};


export function append (parents, element) {
    castElements(parents).forEach(parent => parent.appendChild(element));
};


export function prepend (parents, element) {
    castElements(parents).forEach(parent => parent.insertBefore(element, parent.firstChild));
};


export function remove (elements) {
    eachElement(elements, element => element.parentNode.removeChild(element));
};


export function empty (elements) {
    setProperty(elements, 'innerHTML', '');
};
