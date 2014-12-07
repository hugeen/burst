var $ = require('./dom/query');
var Canvas = require('./draw/canvas');
var AnimationLoop = require('./draw/animation_loop');
var Point = require('./geometry/point');
var Path = require('./geometry/path');
var Tween = require('./tween/tween');


var path1 = new Path([
    new Point(0, 0),
    new Point(0, 100, [new Point(50, -50)])
]);

var path2 = path1.clone();
path2.points[0].translate(100, 0);
path2.points[1].translate(100, 0);


$(function () {
    var canvas = new Canvas($('canvas')[0]);

    this.tween = new Tween({
        from: {
            x: path1.points[0].x,
            y: path1.points[0].y
        },
        to: {
            x: path2.points[0].x,
            y: path2.points[0].y
        },
        duration: 2000,
        bind: path1.points[0]
    });

    this.animLoop = new AnimationLoop(function (deltaTime) {
        canvas.clear();
        canvas.draw(path1);
        canvas.draw(path2);
    });

});