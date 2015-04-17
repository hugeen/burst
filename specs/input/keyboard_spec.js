import assert from 'core/assert';
import * as keyboard from 'input/keyboard';
import * as dom from 'dom/event';
import {on, removeListener} from 'core/event';

var specs = [];

keyboard.enableKeyboard();


specs.push(function (done) {
    var passed = false;
    function passedIfKeyPressed() {
        passed = keyboard.isKeyPressed('A');
    }
    on(document, 'key down', passedIfKeyPressed);
    keyboard.triggerKeyEvent('key down', 'A');
    removeListener(document, 'key down', passedIfKeyPressed);

    done(assert(passed, 'should trigger a key down and set it as pressed'));
});


specs.push(function (done) {
    var passed = false;
    function passedIfKeyPressed() {
        passed = !keyboard.isKeyPressed('A');
    }
    on(document, 'key up', passedIfKeyPressed);
    keyboard.triggerKeyEvent('key up', 'A');
    removeListener(document, 'key up', passedIfKeyPressed);

    done(assert(passed, 'should trigger a key up and unset it as pressed'));
});


specs.push(function (done) {
    var passed = false;
    function passedIfKeyPressed() {
        passed = keyboard.isKeyPressed('ctrl');
    }
    on(document, 'key down', passedIfKeyPressed);
    keyboard.triggerKeyEvent('key down', 'ctrl');
    removeListener(document, 'key down', passedIfKeyPressed);

    done(assert(passed, 'should handle modifiers'));
});


export default {name: 'Keyboard', specs};
