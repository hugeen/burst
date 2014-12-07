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

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/animation_loop.js":[function(require,module,exports){
require('../dom/polyfills/animation')(window);


function AnimationLoop (callback, autostart) {
    this.callback = callback;

    if (autostart || true) {
        this.resume();
    }
}


AnimationLoop.prototype.stop = function () {
    this.running = false;
    cancelAnimationFrame(this.raf);
};


AnimationLoop.prototype.resume = function () {
    this.running = true;
    this.loop();
};


AnimationLoop.prototype.loop = function () {
    var self = this;

    this.raf = requestAnimationFrame(function (time) {
        if (self.running) {
            self.callback(time);
            self.loop();
        }
    });
};


module.exports = AnimationLoop;
},{"../dom/polyfills/animation":"/Users/cyrillebogaert/exp/full_capabilities/dom/polyfills/animation.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js":[function(require,module,exports){
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
},{"./dom/polyfills/animation":"/Users/cyrillebogaert/exp/full_capabilities/dom/polyfills/animation.js","./dom/query":"/Users/cyrillebogaert/exp/full_capabilities/dom/query.js","./draw/animation_loop":"/Users/cyrillebogaert/exp/full_capabilities/draw/animation_loop.js","./draw/canvas":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./geometry/path":"/Users/cyrillebogaert/exp/full_capabilities/geometry/path.js","./geometry/point":"/Users/cyrillebogaert/exp/full_capabilities/geometry/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kb20vcG9seWZpbGxzL2FuaW1hdGlvbi5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZG9tL3F1ZXJ5LmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2FuaW1hdGlvbl9sb29wLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvZHJhd19hcmMuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzL2RyYXdfY2lyY2xlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy9kcmF3X3BhdGguanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2dlb21ldHJ5L2FyYy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZ2VvbWV0cnkvcGF0aC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZ2VvbWV0cnkvcG9pbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGFuaW1hdGlvbkNhcGFiaWxpdGllcyAod2luZG93KSB7XG5cbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblxuXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG5cblxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG5cbiAgICAgICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICB9LCB0aW1lVG9DYWxsKTtcblxuICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG5cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgcmV0dXJuIHdpbmRvdztcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvbkNhcGFiaWxpdGllcztcbiIsInZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5cbmZ1bmN0aW9uICQgKGFyZykge1xuXG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYXJnKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICQoZG9jdW1lbnQpLm9uKCdET01Db250ZW50TG9hZGVkJywgYXJnKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gbmV3IFF1ZXJ5KGFyZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG5cbmZ1bmN0aW9uIFF1ZXJ5IChhcmcpIHtcblxuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmIChhcmcgJiYgYXJnLm5vZGVUeXBlKSB7XG4gICAgICAgIHZhbHVlID0gW2FyZ107XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAnJyArIGFyZyA9PT0gYXJnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhcmcpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFycmF5UHJvdG8ucHVzaC5hcHBseSh0aGlzLCB2YWx1ZSk7XG59XG5cblxuUXVlcnkucHJvdG90eXBlLmxlbmd0aCA9IDA7XG5cblxuUXVlcnkucHJvdG90eXBlLnNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG5cblF1ZXJ5LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChuYW1lLCBmbmMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZuYyk7XG4gICAgfSk7XG59O1xuXG5cblF1ZXJ5LnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChuYW1lLCBmbmMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGZuYyk7XG4gICAgfSk7XG59O1xuXG5cblF1ZXJ5LnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB2YWx1ZSkge1xuICAgIGFycmF5UHJvdG8uZm9yRWFjaC5jYWxsKHRoaXMsIGl0ZXJhdG9yLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gJDtcbiIsInJlcXVpcmUoJy4uL2RvbS9wb2x5ZmlsbHMvYW5pbWF0aW9uJykod2luZG93KTtcblxuXG5mdW5jdGlvbiBBbmltYXRpb25Mb29wIChjYWxsYmFjaywgYXV0b3N0YXJ0KSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgaWYgKGF1dG9zdGFydCB8fCB0cnVlKSB7XG4gICAgICAgIHRoaXMucmVzdW1lKCk7XG4gICAgfVxufVxuXG5cbkFuaW1hdGlvbkxvb3AucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xufTtcblxuXG5BbmltYXRpb25Mb29wLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmxvb3AoKTtcbn07XG5cblxuQW5pbWF0aW9uTG9vcC5wcm90b3R5cGUubG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLnJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAodGltZSkge1xuICAgICAgICBpZiAoc2VsZi5ydW5uaW5nKSB7XG4gICAgICAgICAgICBzZWxmLmNhbGxiYWNrKHRpbWUpO1xuICAgICAgICAgICAgc2VsZi5sb29wKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb25Mb29wOyIsInJlcXVpcmUoJy4vY2FudmFzL2RyYXdfcGF0aCcpKENhbnZhcyk7XG5yZXF1aXJlKCcuL2NhbnZhcy9kcmF3X2FyYycpKENhbnZhcyk7XG5yZXF1aXJlKCcuL2NhbnZhcy9kcmF3X2NpcmNsZScpKENhbnZhcyk7XG5cblxuZnVuY3Rpb24gQ2FudmFzIChlbCkge1xuICAgIHRoaXMuY29udGV4dCA9IGVsLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5lbCA9IGVsO1xufVxuXG5cbkNhbnZhcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmVsLndpZHRoLCB0aGlzLmVsLmhlaWdodCk7XG59O1xuXG5cbkNhbnZhcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICB0aGlzWydkcmF3JyArIGVudGl0eS50eXBlXShlbnRpdHkpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENhbnZhcykge1xuXG4gICAgQ2FudmFzLnByb3RvdHlwZS5kcmF3QXJjID0gZHJhd0FyYztcblxuICAgIHJldHVybiBDYW52YXM7XG59O1xuXG5cbmZ1bmN0aW9uIGRyYXdBcmMgKGFyYykge1xuXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5hcmMoYXJjLngsIGFyYy55LCBhcmMucmFkaXVzLCBhcmMuc3RhcnRBbmdsZSwgYXJjLmVuZEFuZ2xlLCBhcmMuYW50aWNsb2Nrd2lzZSk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cbiIsInZhciBBcmMgPSByZXF1aXJlKCcuLi8uLi9nZW9tZXRyeS9hcmMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDYW52YXMpIHtcblxuICAgIENhbnZhcy5wcm90b3R5cGUuZHJhd0NpcmNsZSA9IGRyYXdDaXJjbGU7XG5cbiAgICByZXR1cm4gQ2FudmFzO1xufTtcblxuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlIChjaXJjbGUpIHtcblxuICAgIHZhciBhcmMgPSBuZXcgQXJjKGNpcmNsZS54LCBjaXJjbGUueSwgY2lyY2xlLnJhZGl1cywgWzAsIDM2MF0pO1xuICAgIHRoaXMuZHJhd0FyYyhhcmMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENhbnZhcykge1xuXG4gICAgQ2FudmFzLnByb3RvdHlwZS5kcmF3UGF0aCA9IGRyYXdQYXRoO1xuXG4gICAgcmV0dXJuIENhbnZhcztcbn07XG5cblxuZnVuY3Rpb24gZHJhd1BhdGggKHBhdGgpIHtcblxuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcG9pbnQgPSBwYXRoLnBvaW50c1tpXTtcblxuICAgICAgICB2YXIgb3BlcmF0aW9uID0gc2VsZWN0RHJhd2luZ09wZXJhdGlvbihwb2ludCwgaSk7XG4gICAgICAgIHZhciBkcmF3aW5nQXJncyA9IGdldERyYXdpbmdBcmdzLmNhbGwocG9pbnQsIG9wZXJhdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0W29wZXJhdGlvbl0uYXBwbHkodGhpcy5jb250ZXh0LCBkcmF3aW5nQXJncyk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cblxuXG5mdW5jdGlvbiBzZWxlY3REcmF3aW5nT3BlcmF0aW9uIChwb2ludCwgaW5kZXgpIHtcblxuICAgIHZhciBvcGVyYXRpb25zID0gWydsaW5lVG8nLCAncXVhZHJhdGljQ3VydmVUbycsICdiZXppZXJDdXJ2ZVRvJ107XG5cbiAgICByZXR1cm4gIWluZGV4ID8gJ21vdmVUbycgOiBvcGVyYXRpb25zW3BvaW50LmNvbnRyb2xQb2ludHMubGVuZ3RoXTtcbn1cblxuXG5mdW5jdGlvbiBnZXREcmF3aW5nQXJncyAob3BlcmF0aW9uKSB7XG5cbiAgICB2YXIgcG9pbnQgPSB0aGlzO1xuXG4gICAgdmFyIG9wZXJhdGlvbnMgPSB7XG4gICAgICAgIG1vdmVUbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtwb2ludC54LCBwb2ludC55XTtcbiAgICAgICAgfSxcbiAgICAgICAgYmV6aWVyQ3VydmVUbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLngsXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1swXS55LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMV0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzFdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55XG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuICAgICAgICBxdWFkcmF0aWNDdXJ2ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG9wZXJhdGlvbnMubGluZVRvID0gb3BlcmF0aW9ucy5tb3ZlVG87XG5cbiAgICByZXR1cm4gb3BlcmF0aW9uc1tvcGVyYXRpb25dKCk7XG59XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxuZnVuY3Rpb24gQXJjICh4LCB5LCByYWRpdXMsIGFuZ2xlcywgYW50aUNsb2Nrd2lzZSkge1xuICAgIHRoaXMudHlwZSA9ICdBcmMnO1xuXG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgIHRoaXMuc3RhcnRBbmdsZSA9IGFuZ2xlc1swXTtcbiAgICB0aGlzLmVuZEFuZ2xlID0gYW5nbGVzWzFdO1xuICAgIHRoaXMuYW50aUNsb2Nrd2lzZSA9IGFudGlDbG9ja3dpc2UgfHwgZmFsc2U7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmM7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxuZnVuY3Rpb24gUGF0aCAoc2VnbWVudHMpIHtcbiAgICB0aGlzLnR5cGUgPSAnUGF0aCc7XG4gICAgdGhpcy5wb2ludHMgPSBzZWdtZW50cyB8fCBbXTtcbn1cblxuXG5QYXRoLnByb3RvdHlwZS5hZGRQb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9pbnRzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5wb2ludHMucHVzaChwb2ludHNbaV0pO1xuICAgIH1cbn07XG5cblxuUGF0aC5wcm90b3R5cGUucmVtb3ZlUG9pbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvaW50cyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnRzW2ldKTtcbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGF0aDtcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBQb2ludCAoeCwgeSwgY29udHJvbFBvaW50cykge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcblxuICAgIHRoaXMuY29udHJvbFBvaW50cyA9IFtdO1xuICAgIHRoaXMuYWRkQ29udHJvbFBvaW50cyhjb250cm9sUG9pbnRzIHx8IFtdKTtcbn1cblxuXG5Qb2ludC5wcm90b3R5cGUuYWRkQ29udHJvbFBvaW50cyA9IGZ1bmN0aW9uIChjcHRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuY29udHJvbFBvaW50c1tpXSA9IG5ldyBQb2ludChjcHRzW2ldLngsIGNwdHNbaV0ueSk7XG4gICAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xuIiwicmVxdWlyZSgnLi9kb20vcG9seWZpbGxzL2FuaW1hdGlvbicpKHdpbmRvdyk7XG5cbnZhciAkID0gcmVxdWlyZSgnLi9kb20vcXVlcnknKTtcbnZhciBDYW52YXMgPSByZXF1aXJlKCcuL2RyYXcvY2FudmFzJyk7XG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL2dlb21ldHJ5L3BvaW50Jyk7XG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vZ2VvbWV0cnkvcGF0aCcpO1xudmFyIEFuaW1hdGlvbkxvb3AgPSByZXF1aXJlKCcuL2RyYXcvYW5pbWF0aW9uX2xvb3AnKTtcbnZhciBwYXRoID0gbmV3IFBhdGgoW1xuICAgIG5ldyBQb2ludCgxMCwgMTApLFxuICAgIG5ldyBQb2ludCgxMCwgMTAwKSxcbiAgICBuZXcgUG9pbnQoMTAwLCAxMDApLFxuICAgIG5ldyBQb2ludCgxMDAsIDEwKSxcbiAgICBuZXcgUG9pbnQoMTAsIDEwKVxuXSk7XG5cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbnZhcyA9IG5ldyBDYW52YXMoJCgnY2FudmFzJylbMF0pO1xuICAgIGNhbnZhcy5kcmF3KHBhdGgpO1xufSk7Il19
