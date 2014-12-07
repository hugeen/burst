require('./dom/polyfills/animation')(window);

var $ = require('./dom/query');
var Canvas = require('./draw/canvas');
var Point = require('./geometry/point');
var Path = require('./geometry/path');
var AnimationLoop = require('./draw/animation_loop');
var path = new Path([
    new Point(10, 10),
    new Point(10, 100),
    new Point(100, 100),
    new Point(100, 10),
    new Point(10, 10)
]);


$(function () {
    var canvas = new Canvas($('canvas')[0]);
    canvas.draw(path);
});