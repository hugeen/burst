var $ = require('./draw/dom');
var Canvas = require('./draw/canvas');
var Path = require('./draw/path');
var Point = require('./draw/point');
var Arc = require('./draw/arc');

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

var arc = Arc.create(20, 20, 10, [0, 360], false);

$(function () {
    var canvas = Canvas.create($('canvas')[0]);
    canvas.drawPath(path);
    canvas.drawArc(arc);
});
