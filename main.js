import eventAbilities from 'glowing_core/event';
import dirtyAbilities from 'glowing_core/dirty';
import $ from 'glowing_dom/sugar';
import loop from 'glowing_loop/sugar';

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


var $hello = $('.hello');

$hello.on('click', function () {
	object.hello += 1;
}).on('click', function () {
	object.hello += 1;
});
// console.log($hello[0][0]);
// console.log($hello.last());

var $body = $('body');
// console.log($body);

console.log($body.find('div, div').find('span'));

loop(function (a) {
	console.log(a);
});

export default {};
