import {toElement} from './utils';


export function getHeight (element) {
    element = toElement(element);
    return Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight);
};


export function getWidth (element) {
    return toElement(element).clientWidth;
};


export function getSize (element) {
    return {
        width: getWidth(element),
        height: getHeight(element)
    };
};


export function getPosition (element) {
    element = toElement(element);

    return {
        left: element.offsetLeft,
        top: element.offsetTop
    };
};


export function getOffset (element) {
    var position = toElement(element).getBoundingClientRect();

    return {
      top: position.top + document.body.scrollTop,
      left: position.left + document.body.scrollLeft
    };
};


export function getPositionFromViewport (element) {
    var {top, left} = toElement(element).getBoundingClientRect();

    return {top, left};
};
