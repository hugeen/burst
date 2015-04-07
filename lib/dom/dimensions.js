import {castElement} from './utils';


export function getHeight (element) {
    element = castElement(element);
    return Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight);
}
