import keysMap from './keys_map';
import {on, emit} from '../core/event';

var keyStates = { 16: false, 18: false, 17: false, 91: false };
var modifiers = {
    16: 'shiftKey',
    18: 'altKey',
    17: 'ctrlKey',
    91: 'metaKey'
};


export function isKeyPressed (keyName) {
    return keyStates[getKeyCode(keyName)] || false;
};


export function isComboPressed (...args) {
    return args.every(keyName => isKeyPressed(keyName));
};


export function getKeyCode (keyName) {
    return specialKeys[keyName] || keyName.toUpperCase().charCodeAt(0);
};


export function updateModifiers (event) {
    for(code in modifiers) {
        keyStates[code] = event[modifiers[code]];
    }
};


export function updateKey (code, state) {
    if (code) {
        keyStates[code] = state;
    }
};


export function resetKeys () {
    for(key in keyStates) {
        keyStates[key] = false;
    }
};


export function keyDown (event) {
    updateModifiers(event);
    updateKey(event.keyCode, true);
};


export function keyUp (event) {
    updateModifiers(event);
    clearKey(event.keyCode, false);
};


export function enableKeyboard (object) {
    on(document, 'key down', keyDown);
    on(document, 'key up', keyUp);
    on(window, 'focus', resetKeys);
};


export function disableKeyboard (object) {
    removeListener(document, 'key down', keyDown);
    removeListener(document, 'key up', keyUp);
    removeListener(window, 'focus', resetKeys);
};
