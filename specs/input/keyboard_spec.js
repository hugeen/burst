import eventsMap from 'dom/events_map';
import assert from 'core/assert';
import * as keyboard from 'input/keyboard';
import * as dom from 'dom/event';
import {on, removeListener} from 'core/event';


function triggerKeyEvent (eventName, key) {
    var e = document.createEvent("KeyboardEvent");
    var keyCode = keyboard.getKeyCode(key);
    e.initKeyboardEvent(eventsMap[eventName] || eventName, true, true, window, keyCode === 16, keyCode === 18, keyCode === 17, keyCode === 91, keyCode, keyCode);

    delete e.keyCode;
    Object.defineProperty(e, 'keyCode', {value : keyCode});

    document.dispatchEvent(e);
}


var specs = [];

keyboard.enableKeyboard();


specs.push(function (done) {
    var passed = false;
    function passedIfKeyPressed() {
        passed = keyboard.isKeyPressed('A');
    }
    on(document, 'key down', passedIfKeyPressed);
    triggerKeyEvent('key down', 'A');
    removeListener(document, 'key down', passedIfKeyPressed);

    done(assert(passed, 'should trigger a key down and set it as pressed'));
});


specs.push(function (done) {
    var passed = false;
    function passedIfKeyPressed() {
        passed = !keyboard.isKeyPressed('A');
    }
    on(document, 'key up', passedIfKeyPressed);
    triggerKeyEvent('key up', 'A');
    removeListener(document, 'key up', passedIfKeyPressed);

    done(assert(passed, 'should trigger a key up and unset it as pressed'));
});


specs.push(function (done) {
    var passed = false;
    function passedIfKeyPressed() {
        passed = keyboard.isKeyPressed('ctrl');
    }
    on(document, 'key down', passedIfKeyPressed);
    triggerKeyEvent('key down', 'ctrl');
    removeListener(document, 'key down', passedIfKeyPressed);

    done(assert(passed, 'should handle modifiers'));
});


export default {name: 'Keyboard', specs};
