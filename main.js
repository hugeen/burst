import animLoop from 'glowing_animation/animation_loop';
import $ from 'glowing_dom/dom_query';
import keyboard from 'glowing_dom/keyboard';

keyboard.on('key down', function (e) {
	console.log(e);
});


var body = $('body');
console.log(body);

export default {};
