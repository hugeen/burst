import eventAbilities from 'glowing_core/event_abilities';
import dirtyAbilities from 'glowing_core/dirty_abilities';
import {addEventProxy, removeEventProxy} from 'glowing_core/event_utils';
var object1 = {};
var object2 = {};

eventAbilities(object1);
eventAbilities(object2);

object1.on('hello', function () {
	console.log('hello');
});

var proxy = addEventProxy([object2, 'on'], [object1, 'emit'], 'hello bitch', 'hello');
removeEventProxy([object2, 'removeListener'], 'hello bitch', proxy);

object2.emit('hello bitch');

export default {};
