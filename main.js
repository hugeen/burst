import eventAbilities from 'glowing_core/event';
import dirtyAbilities from 'glowing_core/dirty';

var object = {
	hello: "world"
};

eventAbilities(object);
dirtyAbilities(object);

object.observable('hello');

object.on('hello changed', function (change) {
	console.log(this.hello, change.oldValue);
});

object.hello = "yo";
setTimeout(function() {
	object.hello = "1234";
}, 1);

export default {};
