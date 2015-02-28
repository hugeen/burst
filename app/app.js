import animLoop from 'glowing_animation/animation_loop';
import $ from 'glowing_dom/dom_query';
import keyboard from 'glowing_dom/keyboard';
import Canvas from 'glowing_renderers/canvas';
import Point from 'glowing_geometry/point';
import Path from 'glowing_geometry/path';

keyboard.on('key down', function (e) {
	console.log(e);
});


var path = new Path();

var p;
path.push(p = new Point(50, 50));
path.push(p = p.clone(0, 50));
path.push(p = p.clone(50, 0));
path.push(p = p.clone(0, -50));
path.push(p = p.clone(-50, 0));

console.log(path);

var canvas = new Canvas($('canvas')[0]);
canvas.drawPath(path);

export default {};
