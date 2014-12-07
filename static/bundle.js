(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/dom/query.js":[function(require,module,exports){
var arrayProto = Array.prototype;


function $ (arg) {

    var value;

    if (typeof arg === 'function') {
        if (document.readyState === 'complete') {
            value = arg();
        } else {
            value = $(document).on('DOMContentLoaded', arg);
        }
    } else {
        value = new Query(arg);
    }

    return value;
}


function Query (arg) {

    var value;

    if (arg && arg.nodeType) {
        value = [arg];
    } else {
        value = '' + arg === arg ? document.querySelectorAll(arg) : undefined;
    }

    arrayProto.push.apply(this, value);
}


Query.prototype.length = 0;


Query.prototype.splice = arrayProto.splice;


Query.prototype.on = function (name, fnc) {
    return this.each(function (el) {
        el.addEventListener(name, fnc);
    });
};


Query.prototype.removeListener = function (name, fnc) {
    return this.each(function (el) {
        el.removeEventListener(name, fnc);
    });
};


Query.prototype.each = function (iterator, value) {
    arrayProto.forEach.call(this, iterator, value);
    return this;
};


module.exports = $;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js":[function(require,module,exports){
require('./canvas/draw_path')(Canvas);
require('./canvas/draw_arc')(Canvas);
require('./canvas/draw_circle')(Canvas);


function Canvas (el) {
    this.context = el.getContext('2d');
    this.el = el;
}


Canvas.prototype.clear = function () {
    this.context.clearRect(0, 0, this.el.width, this.el.height);
};


Canvas.prototype.draw = function (entity) {
    this['draw' + entity.type](entity);
};


module.exports = Canvas;

},{"./canvas/draw_arc":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_arc.js","./canvas/draw_circle":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_circle.js","./canvas/draw_path":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_arc.js":[function(require,module,exports){
module.exports = function (Canvas) {

    Canvas.prototype.drawArc = drawArc;

    return Canvas;
};


function drawArc (arc) {

    this.context.beginPath();
    this.context.arc(arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle, arc.anticlockwise);
    this.context.stroke();

    return this;

}

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_circle.js":[function(require,module,exports){
var Arc = require('../../geometry/arc');


module.exports = function (Canvas) {

    Canvas.prototype.drawCircle = drawCircle;

    return Canvas;
};


function drawCircle (circle) {

    var arc = new Arc(circle.x, circle.y, circle.radius, [0, 360]);
    this.drawArc(arc);

    return this;

}

},{"../../geometry/arc":"/Users/cyrillebogaert/exp/full_capabilities/geometry/arc.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js":[function(require,module,exports){
module.exports = function (Canvas) {

    Canvas.prototype.drawPath = drawPath;

    return Canvas;
};


function drawPath (path) {

    this.context.beginPath();

    for (var i = 0; i < path.points.length; i++) {
        point = path.points[i];

        var operation = selectDrawingOperation(point, i);
        var drawingArgs = getDrawingArgs.call(point, operation);

        this.context[operation].apply(this.context, drawingArgs);
    }

    this.context.stroke();

    return this;

}


function selectDrawingOperation (point, index) {

    var operations = ['lineTo', 'quadraticCurveTo', 'bezierCurveTo'];

    return !index ? 'moveTo' : operations[point.controlPoints.length];
}


function getDrawingArgs (operation) {

    var point = this;

    var operations = {
        moveTo: function () {
            return [point.x, point.y];
        },
        bezierCurveTo: function () {
            return [
                point.controlPoints[0].x,
                point.controlPoints[0].y,
                point.controlPoints[1].x,
                point.controlPoints[1].y,
                point.x,
                point.y
            ];
        },
        quadraticCurveTo: function () {
            return [
                point.controlPoints[0].x,
                point.controlPoints[0].y,
                point.x,
                point.y
            ];
        }
    };

    operations.lineTo = operations.moveTo;

    return operations[operation]();
}

},{}],"/Users/cyrillebogaert/exp/full_capabilities/geometry/arc.js":[function(require,module,exports){
var slice = Array.prototype.slice;


function Arc (x, y, radius, angles, antiClockwise) {
    this.type = 'Arc';

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = angles[0];
    this.endAngle = angles[1];
    this.antiClockwise = antiClockwise || false;
}


module.exports = Arc;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/geometry/path.js":[function(require,module,exports){
var slice = Array.prototype.slice;


function Path (segments) {
    this.type = 'Path';
    this.points = segments || [];
}


Path.prototype.addPoint = function () {
    var points = slice.call(arguments);

    for (var i = 0; i < points.length; i++) {
        this.points.push(points[i]);
    }
};


Path.prototype.removePoint = function () {
    var points = slice.call(arguments);

    for (var i = 0; i < points.length; i++) {
        this.points.push(points[i]);
    }
};


module.exports = Path;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/geometry/point.js":[function(require,module,exports){
var slice = Array.prototype.slice;


function Point (x, y, controlPoints) {
    this.x = x;
    this.y = y;

    this.controlPoints = [];
    this.addControlPoints(controlPoints || []);
}


Point.prototype.addControlPoints = function (cpts) {
    for (var i = 0; i < cpts.length; i++) {
        this.controlPoints[i] = new Point(cpts[i].x, cpts[i].y);
    }
};


module.exports = Point;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/main.js":[function(require,module,exports){
var $ = require('./dom/query');
var Canvas = require('./draw/canvas');
var Point = require('./geometry/point');
var Path = require('./geometry/path');

var path = new Path([
    new Point(10, 10),
    new Point(10, 100),
    new Point(100, 100),
    new Point(100, 10)
]);


$(function () {
    var canvas = new Canvas($('canvas')[0]);
    canvas.draw(path);
    console.log(path);
});
},{"./dom/query":"/Users/cyrillebogaert/exp/full_capabilities/dom/query.js","./draw/canvas":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./geometry/path":"/Users/cyrillebogaert/exp/full_capabilities/geometry/path.js","./geometry/point":"/Users/cyrillebogaert/exp/full_capabilities/geometry/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kb20vcXVlcnkuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy9kcmF3X2FyYy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvZHJhd19jaXJjbGUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzL2RyYXdfcGF0aC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZ2VvbWV0cnkvYXJjLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9nZW9tZXRyeS9wYXRoLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9nZW9tZXRyeS9wb2ludC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5cbmZ1bmN0aW9uICQgKGFyZykge1xuXG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYXJnKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICQoZG9jdW1lbnQpLm9uKCdET01Db250ZW50TG9hZGVkJywgYXJnKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gbmV3IFF1ZXJ5KGFyZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG5cbmZ1bmN0aW9uIFF1ZXJ5IChhcmcpIHtcblxuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmIChhcmcgJiYgYXJnLm5vZGVUeXBlKSB7XG4gICAgICAgIHZhbHVlID0gW2FyZ107XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAnJyArIGFyZyA9PT0gYXJnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhcmcpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFycmF5UHJvdG8ucHVzaC5hcHBseSh0aGlzLCB2YWx1ZSk7XG59XG5cblxuUXVlcnkucHJvdG90eXBlLmxlbmd0aCA9IDA7XG5cblxuUXVlcnkucHJvdG90eXBlLnNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG5cblF1ZXJ5LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChuYW1lLCBmbmMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZuYyk7XG4gICAgfSk7XG59O1xuXG5cblF1ZXJ5LnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChuYW1lLCBmbmMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGZuYyk7XG4gICAgfSk7XG59O1xuXG5cblF1ZXJ5LnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB2YWx1ZSkge1xuICAgIGFycmF5UHJvdG8uZm9yRWFjaC5jYWxsKHRoaXMsIGl0ZXJhdG9yLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gJDtcbiIsInJlcXVpcmUoJy4vY2FudmFzL2RyYXdfcGF0aCcpKENhbnZhcyk7XG5yZXF1aXJlKCcuL2NhbnZhcy9kcmF3X2FyYycpKENhbnZhcyk7XG5yZXF1aXJlKCcuL2NhbnZhcy9kcmF3X2NpcmNsZScpKENhbnZhcyk7XG5cblxuZnVuY3Rpb24gQ2FudmFzIChlbCkge1xuICAgIHRoaXMuY29udGV4dCA9IGVsLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5lbCA9IGVsO1xufVxuXG5cbkNhbnZhcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmVsLndpZHRoLCB0aGlzLmVsLmhlaWdodCk7XG59O1xuXG5cbkNhbnZhcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICB0aGlzWydkcmF3JyArIGVudGl0eS50eXBlXShlbnRpdHkpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENhbnZhcykge1xuXG4gICAgQ2FudmFzLnByb3RvdHlwZS5kcmF3QXJjID0gZHJhd0FyYztcblxuICAgIHJldHVybiBDYW52YXM7XG59O1xuXG5cbmZ1bmN0aW9uIGRyYXdBcmMgKGFyYykge1xuXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5hcmMoYXJjLngsIGFyYy55LCBhcmMucmFkaXVzLCBhcmMuc3RhcnRBbmdsZSwgYXJjLmVuZEFuZ2xlLCBhcmMuYW50aWNsb2Nrd2lzZSk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cbiIsInZhciBBcmMgPSByZXF1aXJlKCcuLi8uLi9nZW9tZXRyeS9hcmMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDYW52YXMpIHtcblxuICAgIENhbnZhcy5wcm90b3R5cGUuZHJhd0NpcmNsZSA9IGRyYXdDaXJjbGU7XG5cbiAgICByZXR1cm4gQ2FudmFzO1xufTtcblxuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlIChjaXJjbGUpIHtcblxuICAgIHZhciBhcmMgPSBuZXcgQXJjKGNpcmNsZS54LCBjaXJjbGUueSwgY2lyY2xlLnJhZGl1cywgWzAsIDM2MF0pO1xuICAgIHRoaXMuZHJhd0FyYyhhcmMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENhbnZhcykge1xuXG4gICAgQ2FudmFzLnByb3RvdHlwZS5kcmF3UGF0aCA9IGRyYXdQYXRoO1xuXG4gICAgcmV0dXJuIENhbnZhcztcbn07XG5cblxuZnVuY3Rpb24gZHJhd1BhdGggKHBhdGgpIHtcblxuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcG9pbnQgPSBwYXRoLnBvaW50c1tpXTtcblxuICAgICAgICB2YXIgb3BlcmF0aW9uID0gc2VsZWN0RHJhd2luZ09wZXJhdGlvbihwb2ludCwgaSk7XG4gICAgICAgIHZhciBkcmF3aW5nQXJncyA9IGdldERyYXdpbmdBcmdzLmNhbGwocG9pbnQsIG9wZXJhdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0W29wZXJhdGlvbl0uYXBwbHkodGhpcy5jb250ZXh0LCBkcmF3aW5nQXJncyk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cblxuXG5mdW5jdGlvbiBzZWxlY3REcmF3aW5nT3BlcmF0aW9uIChwb2ludCwgaW5kZXgpIHtcblxuICAgIHZhciBvcGVyYXRpb25zID0gWydsaW5lVG8nLCAncXVhZHJhdGljQ3VydmVUbycsICdiZXppZXJDdXJ2ZVRvJ107XG5cbiAgICByZXR1cm4gIWluZGV4ID8gJ21vdmVUbycgOiBvcGVyYXRpb25zW3BvaW50LmNvbnRyb2xQb2ludHMubGVuZ3RoXTtcbn1cblxuXG5mdW5jdGlvbiBnZXREcmF3aW5nQXJncyAob3BlcmF0aW9uKSB7XG5cbiAgICB2YXIgcG9pbnQgPSB0aGlzO1xuXG4gICAgdmFyIG9wZXJhdGlvbnMgPSB7XG4gICAgICAgIG1vdmVUbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtwb2ludC54LCBwb2ludC55XTtcbiAgICAgICAgfSxcbiAgICAgICAgYmV6aWVyQ3VydmVUbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLngsXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1swXS55LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMV0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzFdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55XG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuICAgICAgICBxdWFkcmF0aWNDdXJ2ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG9wZXJhdGlvbnMubGluZVRvID0gb3BlcmF0aW9ucy5tb3ZlVG87XG5cbiAgICByZXR1cm4gb3BlcmF0aW9uc1tvcGVyYXRpb25dKCk7XG59XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxuZnVuY3Rpb24gQXJjICh4LCB5LCByYWRpdXMsIGFuZ2xlcywgYW50aUNsb2Nrd2lzZSkge1xuICAgIHRoaXMudHlwZSA9ICdBcmMnO1xuXG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgIHRoaXMuc3RhcnRBbmdsZSA9IGFuZ2xlc1swXTtcbiAgICB0aGlzLmVuZEFuZ2xlID0gYW5nbGVzWzFdO1xuICAgIHRoaXMuYW50aUNsb2Nrd2lzZSA9IGFudGlDbG9ja3dpc2UgfHwgZmFsc2U7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmM7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxuZnVuY3Rpb24gUGF0aCAoc2VnbWVudHMpIHtcbiAgICB0aGlzLnR5cGUgPSAnUGF0aCc7XG4gICAgdGhpcy5wb2ludHMgPSBzZWdtZW50cyB8fCBbXTtcbn1cblxuXG5QYXRoLnByb3RvdHlwZS5hZGRQb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9pbnRzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5wb2ludHMucHVzaChwb2ludHNbaV0pO1xuICAgIH1cbn07XG5cblxuUGF0aC5wcm90b3R5cGUucmVtb3ZlUG9pbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvaW50cyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnRzW2ldKTtcbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGF0aDtcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBQb2ludCAoeCwgeSwgY29udHJvbFBvaW50cykge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcblxuICAgIHRoaXMuY29udHJvbFBvaW50cyA9IFtdO1xuICAgIHRoaXMuYWRkQ29udHJvbFBvaW50cyhjb250cm9sUG9pbnRzIHx8IFtdKTtcbn1cblxuXG5Qb2ludC5wcm90b3R5cGUuYWRkQ29udHJvbFBvaW50cyA9IGZ1bmN0aW9uIChjcHRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuY29udHJvbFBvaW50c1tpXSA9IG5ldyBQb2ludChjcHRzW2ldLngsIGNwdHNbaV0ueSk7XG4gICAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xuIiwidmFyICQgPSByZXF1aXJlKCcuL2RvbS9xdWVyeScpO1xudmFyIENhbnZhcyA9IHJlcXVpcmUoJy4vZHJhdy9jYW52YXMnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vZ2VvbWV0cnkvcG9pbnQnKTtcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9nZW9tZXRyeS9wYXRoJyk7XG5cbnZhciBwYXRoID0gbmV3IFBhdGgoW1xuICAgIG5ldyBQb2ludCgxMCwgMTApLFxuICAgIG5ldyBQb2ludCgxMCwgMTAwKSxcbiAgICBuZXcgUG9pbnQoMTAwLCAxMDApLFxuICAgIG5ldyBQb2ludCgxMDAsIDEwKVxuXSk7XG5cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbnZhcyA9IG5ldyBDYW52YXMoJCgnY2FudmFzJylbMF0pO1xuICAgIGNhbnZhcy5kcmF3KHBhdGgpO1xuICAgIGNvbnNvbGUubG9nKHBhdGgpO1xufSk7Il19
