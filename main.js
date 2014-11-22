var $ = require('./draw/dom.js');
var Canvas = require('./draw/canvas.js');
var Path = require('./draw/path.js');
var Point = require('./draw/point.js');

var path = Path.create();

path.add(
    Point.create(75, 40),
    Point.create(50, 25, [
        [75, 37],
        [70, 25]
    ]),
    Point.create(20, 62.5, [
        [20, 25],
        [20, 62.5]
    ]),
    Point.create(75, 120, [
        [20, 80],
        [40, 102]
    ]),
    Point.create(130, 62.5, [
        [110, 102],
        [130, 80]
    ]),
    Point.create(100, 25, [
        [130, 62.5],
        [130, 25]
    ]),
    Point.create(75, 40, [
        [85, 25],
        [75, 37]
    ])
);


$(function() {
    var canvas = Canvas.create($('canvas')[0]);
    canvas.drawPath(path);
});
