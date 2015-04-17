import keysMap from './keys_map';
import eventsMap from '../dom/events_map';
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
    return keysMap[keyName] || keyName.toUpperCase().charCodeAt(0);
};


export function updateModifiers (event) {
    for (let code in modifiers) {
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


export function keyDownListener (event) {
    updateModifiers(event);
    updateKey(event.keyCode, true);
};


export function keyUpListener (event) {
    updateModifiers(event);
    updateKey(event.keyCode, false);
};


export function triggerKeyEvent (eventName, key) {
    var e = document.createEvent("KeyboardEvent");
    var keyCode = getKeyCode(key);

    e.initKeyboardEvent(eventsMap[eventName] || eventName, true, true, window, keyCode === 16, keyCode === 18, keyCode === 17, keyCode === 91, keyCode, keyCode);

    delete e.keyCode;
    Object.defineProperty(e, 'keyCode', {value : keyCode});

    document.dispatchEvent(e);
};


export function enableKeyboard (object) {
    on(document, 'key down', keyDownListener);
    on(document, 'key up', keyUpListener);
    on(window, 'focus', resetKeys);
};


export function disableKeyboard (object) {
    removeListener(document, 'key down', keyDownListener);
    removeListener(document, 'key up', keyUpListener);
    removeListener(window, 'focus', resetKeys);
};
