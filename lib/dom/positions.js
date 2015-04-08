
import {castElement} from './utils';


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
