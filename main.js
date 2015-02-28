import eventAbilities from 'glowing_core/event_abilities';
import dirtyAbilities from 'glowing_core/dirty_abilities';
import {addEventProxy, removeEventProxy} from 'glowing_core/event_utils';
import HttpRequest from 'glowing_transport/http_request';

var object1 = {};
var object2 = {};

eventAbilities(object1);
eventAbilities(object2);

object1.on('hello', function () {
	console.log('hello');
});

var proxy = addEventProxy(object2, object1, 'hello bitch', 'hello');
removeEventProxy(object2, 'hello bitch', proxy);

object1.on('hello', function () {
	console.log('hello');
});
object2.emit('hello bitch');

var http = new HttpRequest({ method: 'get' });
http.on('loaded', function () {
	console.log('h');
});

http.send();

addEventProxy([document, 'addEventListener'], object1, 'click', 'hello');
export default {};
