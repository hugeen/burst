(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/dom/polyfills/animation.js":[function(require,module,exports){
function animationCapabilities (window) {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];


    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }


    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));

            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);

            lastTime = currTime + timeToCall;

            return id;
        };
    }


    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }


    return window;
}


module.exports = animationCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/dom/query.js":[function(require,module,exports){
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
require('./dom/polyfills/animation')(window);

var $ = require('./dom/query');
var Canvas = require('./draw/canvas');
var Point = require('./geometry/point');
var Path = require('./geometry/path');

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
    requestAnimationFrame(function() {
        console.log('hello');
    });
});
},{"./dom/polyfills/animation":"/Users/cyrillebogaert/exp/full_capabilities/dom/polyfills/animation.js","./dom/query":"/Users/cyrillebogaert/exp/full_capabilities/dom/query.js","./draw/canvas":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./geometry/path":"/Users/cyrillebogaert/exp/full_capabilities/geometry/path.js","./geometry/point":"/Users/cyrillebogaert/exp/full_capabilities/geometry/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kb20vcG9seWZpbGxzL2FuaW1hdGlvbi5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZG9tL3F1ZXJ5LmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvZHJhd19hcmMuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzL2RyYXdfY2lyY2xlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy9kcmF3X3BhdGguanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2dlb21ldHJ5L2FyYy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZ2VvbWV0cnkvcGF0aC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZ2VvbWV0cnkvcG9pbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gYW5pbWF0aW9uQ2FwYWJpbGl0aWVzICh3aW5kb3cpIHtcblxuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuXG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cblxuXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcblxuICAgICAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIH0sIHRpbWVUb0NhbGwpO1xuXG4gICAgICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcblxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICByZXR1cm4gd2luZG93O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uQ2FwYWJpbGl0aWVzO1xuIiwidmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cblxuZnVuY3Rpb24gJCAoYXJnKSB7XG5cbiAgICB2YXIgdmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgdmFsdWUgPSBhcmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gJChkb2N1bWVudCkub24oJ0RPTUNvbnRlbnRMb2FkZWQnLCBhcmcpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBuZXcgUXVlcnkoYXJnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cblxuZnVuY3Rpb24gUXVlcnkgKGFyZykge1xuXG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKGFyZyAmJiBhcmcubm9kZVR5cGUpIHtcbiAgICAgICAgdmFsdWUgPSBbYXJnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9ICcnICsgYXJnID09PSBhcmcgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFyZykgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJyYXlQcm90by5wdXNoLmFwcGx5KHRoaXMsIHZhbHVlKTtcbn1cblxuXG5RdWVyeS5wcm90b3R5cGUubGVuZ3RoID0gMDtcblxuXG5RdWVyeS5wcm90b3R5cGUuc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cblxuUXVlcnkucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZm5jKTtcbiAgICB9KTtcbn07XG5cblxuUXVlcnkucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZm5jKTtcbiAgICB9KTtcbn07XG5cblxuUXVlcnkucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbiAoaXRlcmF0b3IsIHZhbHVlKSB7XG4gICAgYXJyYXlQcm90by5mb3JFYWNoLmNhbGwodGhpcywgaXRlcmF0b3IsIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSAkO1xuIiwicmVxdWlyZSgnLi9jYW52YXMvZHJhd19wYXRoJykoQ2FudmFzKTtcbnJlcXVpcmUoJy4vY2FudmFzL2RyYXdfYXJjJykoQ2FudmFzKTtcbnJlcXVpcmUoJy4vY2FudmFzL2RyYXdfY2lyY2xlJykoQ2FudmFzKTtcblxuXG5mdW5jdGlvbiBDYW52YXMgKGVsKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gZWwuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmVsID0gZWw7XG59XG5cblxuQ2FudmFzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuZWwud2lkdGgsIHRoaXMuZWwuaGVpZ2h0KTtcbn07XG5cblxuQ2FudmFzLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGVudGl0eSkge1xuICAgIHRoaXNbJ2RyYXcnICsgZW50aXR5LnR5cGVdKGVudGl0eSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ2FudmFzKSB7XG5cbiAgICBDYW52YXMucHJvdG90eXBlLmRyYXdBcmMgPSBkcmF3QXJjO1xuXG4gICAgcmV0dXJuIENhbnZhcztcbn07XG5cblxuZnVuY3Rpb24gZHJhd0FyYyAoYXJjKSB7XG5cbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0LmFyYyhhcmMueCwgYXJjLnksIGFyYy5yYWRpdXMsIGFyYy5zdGFydEFuZ2xlLCBhcmMuZW5kQW5nbGUsIGFyYy5hbnRpY2xvY2t3aXNlKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcblxufVxuIiwidmFyIEFyYyA9IHJlcXVpcmUoJy4uLy4uL2dlb21ldHJ5L2FyYycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENhbnZhcykge1xuXG4gICAgQ2FudmFzLnByb3RvdHlwZS5kcmF3Q2lyY2xlID0gZHJhd0NpcmNsZTtcblxuICAgIHJldHVybiBDYW52YXM7XG59O1xuXG5cbmZ1bmN0aW9uIGRyYXdDaXJjbGUgKGNpcmNsZSkge1xuXG4gICAgdmFyIGFyYyA9IG5ldyBBcmMoY2lyY2xlLngsIGNpcmNsZS55LCBjaXJjbGUucmFkaXVzLCBbMCwgMzYwXSk7XG4gICAgdGhpcy5kcmF3QXJjKGFyYyk7XG5cbiAgICByZXR1cm4gdGhpcztcblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ2FudmFzKSB7XG5cbiAgICBDYW52YXMucHJvdG90eXBlLmRyYXdQYXRoID0gZHJhd1BhdGg7XG5cbiAgICByZXR1cm4gQ2FudmFzO1xufTtcblxuXG5mdW5jdGlvbiBkcmF3UGF0aCAocGF0aCkge1xuXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwb2ludCA9IHBhdGgucG9pbnRzW2ldO1xuXG4gICAgICAgIHZhciBvcGVyYXRpb24gPSBzZWxlY3REcmF3aW5nT3BlcmF0aW9uKHBvaW50LCBpKTtcbiAgICAgICAgdmFyIGRyYXdpbmdBcmdzID0gZ2V0RHJhd2luZ0FyZ3MuY2FsbChwb2ludCwgb3BlcmF0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHRbb3BlcmF0aW9uXS5hcHBseSh0aGlzLmNvbnRleHQsIGRyYXdpbmdBcmdzKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcblxufVxuXG5cbmZ1bmN0aW9uIHNlbGVjdERyYXdpbmdPcGVyYXRpb24gKHBvaW50LCBpbmRleCkge1xuXG4gICAgdmFyIG9wZXJhdGlvbnMgPSBbJ2xpbmVUbycsICdxdWFkcmF0aWNDdXJ2ZVRvJywgJ2JlemllckN1cnZlVG8nXTtcblxuICAgIHJldHVybiAhaW5kZXggPyAnbW92ZVRvJyA6IG9wZXJhdGlvbnNbcG9pbnQuY29udHJvbFBvaW50cy5sZW5ndGhdO1xufVxuXG5cbmZ1bmN0aW9uIGdldERyYXdpbmdBcmdzIChvcGVyYXRpb24pIHtcblxuICAgIHZhciBwb2ludCA9IHRoaXM7XG5cbiAgICB2YXIgb3BlcmF0aW9ucyA9IHtcbiAgICAgICAgbW92ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW3BvaW50LngsIHBvaW50LnldO1xuICAgICAgICB9LFxuICAgICAgICBiZXppZXJDdXJ2ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1sxXS54LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMV0ueSxcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0sXG4gICAgICAgIHF1YWRyYXRpY0N1cnZlVG86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1swXS54LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueSxcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgb3BlcmF0aW9ucy5saW5lVG8gPSBvcGVyYXRpb25zLm1vdmVUbztcblxuICAgIHJldHVybiBvcGVyYXRpb25zW29wZXJhdGlvbl0oKTtcbn1cbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBBcmMgKHgsIHksIHJhZGl1cywgYW5nbGVzLCBhbnRpQ2xvY2t3aXNlKSB7XG4gICAgdGhpcy50eXBlID0gJ0FyYyc7XG5cbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy5zdGFydEFuZ2xlID0gYW5nbGVzWzBdO1xuICAgIHRoaXMuZW5kQW5nbGUgPSBhbmdsZXNbMV07XG4gICAgdGhpcy5hbnRpQ2xvY2t3aXNlID0gYW50aUNsb2Nrd2lzZSB8fCBmYWxzZTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyYztcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBQYXRoIChzZWdtZW50cykge1xuICAgIHRoaXMudHlwZSA9ICdQYXRoJztcbiAgICB0aGlzLnBvaW50cyA9IHNlZ21lbnRzIHx8IFtdO1xufVxuXG5cblBhdGgucHJvdG90eXBlLmFkZFBvaW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb2ludHMgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnBvaW50cy5wdXNoKHBvaW50c1tpXSk7XG4gICAgfVxufTtcblxuXG5QYXRoLnByb3RvdHlwZS5yZW1vdmVQb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9pbnRzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5wb2ludHMucHVzaChwb2ludHNbaV0pO1xuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQYXRoO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cbmZ1bmN0aW9uIFBvaW50ICh4LCB5LCBjb250cm9sUG9pbnRzKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuXG4gICAgdGhpcy5jb250cm9sUG9pbnRzID0gW107XG4gICAgdGhpcy5hZGRDb250cm9sUG9pbnRzKGNvbnRyb2xQb2ludHMgfHwgW10pO1xufVxuXG5cblBvaW50LnByb3RvdHlwZS5hZGRDb250cm9sUG9pbnRzID0gZnVuY3Rpb24gKGNwdHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNwdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5jb250cm9sUG9pbnRzW2ldID0gbmV3IFBvaW50KGNwdHNbaV0ueCwgY3B0c1tpXS55KTtcbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG4iLCJyZXF1aXJlKCcuL2RvbS9wb2x5ZmlsbHMvYW5pbWF0aW9uJykod2luZG93KTtcblxudmFyICQgPSByZXF1aXJlKCcuL2RvbS9xdWVyeScpO1xudmFyIENhbnZhcyA9IHJlcXVpcmUoJy4vZHJhdy9jYW52YXMnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vZ2VvbWV0cnkvcG9pbnQnKTtcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9nZW9tZXRyeS9wYXRoJyk7XG5cbnZhciBwYXRoID0gbmV3IFBhdGgoW1xuICAgIG5ldyBQb2ludCgxMCwgMTApLFxuICAgIG5ldyBQb2ludCgxMCwgMTAwKSxcbiAgICBuZXcgUG9pbnQoMTAwLCAxMDApLFxuICAgIG5ldyBQb2ludCgxMDAsIDEwKSxcbiAgICBuZXcgUG9pbnQoMTAsIDEwKVxuXSk7XG5cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbnZhcyA9IG5ldyBDYW52YXMoJCgnY2FudmFzJylbMF0pO1xuICAgIGNhbnZhcy5kcmF3KHBhdGgpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hlbGxvJyk7XG4gICAgfSk7XG59KTsiXX0=
