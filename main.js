var $ = require('./draw/dom.js');
var Canvas = require('./draw/canvas.js');
var Path = require('./draw/path.js');
var Point = require('./draw/point.js');

var path = Path.create();

path.add(Point.create(10, 10));
path.add(Point.create(100, 10));
path.add(Point.create(100, 100));
path.add(Point.create(10, 100));

$(function() {
    var canvas = Canvas.create($('canvas')[0]);
    canvas.drawPath(path);
});
