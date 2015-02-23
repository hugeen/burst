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

object.hello = 1;


var $hello = new DomQuery('.hello');

$hello.on('click', function () {
	object.hello += 1;
});
// console.log($hello[0][0]);
console.log($hello.last());

export default {};
