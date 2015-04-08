import {castElement} from './utils';


export function getHeight (element) {
    element = castElement(element);
    return Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight);
}


export function getWidth (element) {
    return castElement(element).clientWidth;
}


export function getSize (element) {
    return {
        width: getWidth(element),
        height: getHeight(element)
    };
}


export function getPosition (element) {
    element = castElement(element);

    return {
        left: element.offsetLeft,
        top: element.offsetTop
    };
}


export function getOffset (element) {
    var position = castElement(element).getBoundingClientRect();

    return {
      top: position.top + document.body.scrollTop,
      left: position.left + document.body.scrollLeft
    };
}


export function getPositionFromViewport (element) {
    var {top, left} = castElement(element).getBoundingClientRect();

    return {top, left};
}
