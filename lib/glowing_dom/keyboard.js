import eventAbilities from 'glowing_core/event_abilities';
import {addEventProxy} from 'glowing_core/event_utils';

var keyboard = {}
eventAbilities(keyboard);


export default keyboard;


window.addEventListener('keypress', function (e) {
	if(!e.repeat) {
		keyboard.emit('key pressed', e);
	}
});

addEventProxy([window, 'addEventListener'], keyboard, 'keydown', 'key down');

addEventProxy([window, 'addEventListener'], keyboard, 'keyup', 'key released');
