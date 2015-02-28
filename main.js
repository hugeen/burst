import animLoop from 'glowing_animation/animation_loop';
import $ from 'glowing_dom/dom_query';
import keyboard from 'glowing_dom/keyboard';
import Canvas from 'glowing_renderers/canvas';

keyboard.on('key down', function (e) {
	console.log(e);
});


var canvas = new Canvas($('canvas')[0]);
canvas.drawPath('hello');

export default {};
