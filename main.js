import eventAbilities from 'glowing_core/event';
import dirtyAbilities from 'glowing_core/dirty';
import DomQuery from 'glowing_dom/dom_query';

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

var $hello = new DomQuery('.hello');

$hello.on('click', function () {
	console.log('bitch');
});
// console.log($hello[0][0]);

export default {};
