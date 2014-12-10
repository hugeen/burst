var $ = require('./dom/query');
var Canvas = require('./draw/canvas');
var AnimationLoop = require('./draw/animation_loop');
var Point = require('./geometry/point');
var Path = require('./geometry/path');
var Tween = require('./tween/tween');


var path1 = new Path([
    new Point(0, 20),
    new Point(0, 100, [new Point(50, -50)])
]);

var path2 = path1.clone();
path2.points[0].translate(100, 0);
path2.points[1].translate(100, 0);


$(function () {
    var canvas = new Canvas($('canvas')[0]);

    // path1.points[0].tween(path2.points[0]);
    path1.points[1].tween(path2.points[1]);

    canvas.animate(function() {
        canvas.draw(path1);
        canvas.draw(path2);
    });

});