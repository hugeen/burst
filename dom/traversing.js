import {isElement} from './utils';

export function getElements (selector, parent) {
    parent = parent || document;
    return isElement(selector) ? [selector] : parent.querySelectorAll(selector);
};
