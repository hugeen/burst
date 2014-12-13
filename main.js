var $ = require('./dom/query');
var Canvas = require('./draw/canvas');
var AnimationLoop = require('./draw/animation_loop');
var Point = require('./geometry/point');
var Path = require('./geometry/path');


var path1 = new Path([
    new Point(0, 20),
    new Point(0, 100, [new Point(50, -50)])
]);


$(function () {
    var canvas = new Canvas($('canvas')[0]);

    canvas.animate(function() {
        canvas.draw(path1);
    });

});