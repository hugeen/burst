import assert from 'assert';
import eventsMap from '../../dom/events_map';
import * as keyboard from '../../input/keyboard';
import * as dom from '../../dom/event';
import {on, removeListener} from '../../core/event';



describe('Input Keyboard', function () {


    function triggerKeyEvent (eventName, key) {
        var e = document.createEvent("KeyboardEvent");
        var keyCode = keyboard.getKeyCode(key);
        e.initKeyEvent(eventsMap[eventName] || eventName, true, true, window, keyCode === 16, keyCode === 18, keyCode === 17, keyCode === 91, keyCode, keyCode);

        delete e.keyCode;
        Object.defineProperty(e, 'keyCode', {value : keyCode});

        document.dispatchEvent(e);
    }


    beforeEach(function () {
        keyboard.enableKeyboard();
    });


    it('should trigger a key down and set it as pressed', function () {
        var passed = false;
        function passedIfKeyPressed() {
            passed = keyboard.isKeyPressed('A');
        }
        on(document, 'key down', passedIfKeyPressed);
        triggerKeyEvent('key down', 'A');
        removeListener(document, 'key down', passedIfKeyPressed);
        assert(passed);
    });


    it('should trigger a key up and unset it as pressed', function () {
        var passed = false;
        function passedIfKeyPressed() {
            passed = !keyboard.isKeyPressed('A');
        }
        on(document, 'key up', passedIfKeyPressed);
        triggerKeyEvent('key up', 'A');
        removeListener(document, 'key up', passedIfKeyPressed);
        assert(passed);
    });


    it('should handle modifiers', function () {
        var passed = false;
        function passedIfKeyPressed() {
            passed = keyboard.isKeyPressed('ctrl');
        }
        on(document, 'key down', passedIfKeyPressed);
        triggerKeyEvent('key down', 'ctrl');
        removeListener(document, 'key down', passedIfKeyPressed);
        assert(passed);
    });


});
