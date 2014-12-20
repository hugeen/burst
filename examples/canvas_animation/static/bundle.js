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
    this.lastTime = 0;
    this.running = true;
    this.loop();
};


AnimationLoop.prototype.loop = function () {
    var self = this;

    this.raf = requestAnimationFrame(function (time) {
        if (self.running) {
            var deltaTime = Math.min(0.5, (time - self.lastTime) * 0.001);
            self.lastTime = time;
            self.callback(deltaTime);
            self.loop();
        }
    });
};


module.exports = AnimationLoop;
},{"../dom/polyfills/animation":"/Users/cyrillebogaert/exp/full_capabilities/dom/polyfills/animation.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js":[function(require,module,exports){
require('./canvas/draw_path')(Canvas);
require('./canvas/draw_arc')(Canvas);
require('./canvas/draw_circle')(Canvas);
require('./canvas/animate')(Canvas);


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

},{"./canvas/animate":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/animate.js","./canvas/draw_arc":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_arc.js","./canvas/draw_circle":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_circle.js","./canvas/draw_path":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/animate.js":[function(require,module,exports){
module.exports = function (Canvas) {

    Canvas.prototype.animate = animate;

    return Canvas;
};


var AnimationLoop = require('../animation_loop');

function animate (fnc) {

    var self = this;

    this.animationLoop = new AnimationLoop(function (deltaTime) {
        self.clear();
        fnc.call(self, deltaTime);
    });

    return this;
}

},{"../animation_loop":"/Users/cyrillebogaert/exp/full_capabilities/draw/animation_loop.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_arc.js":[function(require,module,exports){
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
module.exports = function (Canvas) {

    Canvas.prototype.drawCircle = drawCircle;

    return Canvas;
};


var Arc = require('../../geometry/arc');

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
        var point = path.points[i];
        var operation = !i ? 'moveTo' : 'lineTo';
        this.context[operation].apply(this.context, [point.x, point.y]);
    }

    this.context.stroke();

    return this;

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
function Path (points) {
    this.type = 'Path';
    this.points = points || [];
}


Path.prototype.clone = function () {
    var points = [];
    for (var i = 0; i < this.points.length; i++) {
        points.push(this.points[i].clone());
    }

    return new Path(points);
};


module.exports = Path;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/geometry/point.js":[function(require,module,exports){
function Point (x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.clone = function () {
    return new Point(this.x, this.y);
};


module.exports = Point;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/main.js":[function(require,module,exports){
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
},{"./dom/query":"/Users/cyrillebogaert/exp/full_capabilities/dom/query.js","./draw/animation_loop":"/Users/cyrillebogaert/exp/full_capabilities/draw/animation_loop.js","./draw/canvas":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./geometry/path":"/Users/cyrillebogaert/exp/full_capabilities/geometry/path.js","./geometry/point":"/Users/cyrillebogaert/exp/full_capabilities/geometry/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kb20vcG9seWZpbGxzL2FuaW1hdGlvbi5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZG9tL3F1ZXJ5LmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2FuaW1hdGlvbl9sb29wLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvYW5pbWF0ZS5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvZHJhd19hcmMuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzL2RyYXdfY2lyY2xlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy9kcmF3X3BhdGguanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2dlb21ldHJ5L2FyYy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZ2VvbWV0cnkvcGF0aC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZ2VvbWV0cnkvcG9pbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gYW5pbWF0aW9uQ2FwYWJpbGl0aWVzICh3aW5kb3cpIHtcblxuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuXG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cblxuXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcblxuICAgICAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIH0sIHRpbWVUb0NhbGwpO1xuXG4gICAgICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcblxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICByZXR1cm4gd2luZG93O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0aW9uQ2FwYWJpbGl0aWVzO1xuIiwidmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cblxuZnVuY3Rpb24gJCAoYXJnKSB7XG5cbiAgICB2YXIgdmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgdmFsdWUgPSBhcmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gJChkb2N1bWVudCkub24oJ0RPTUNvbnRlbnRMb2FkZWQnLCBhcmcpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBuZXcgUXVlcnkoYXJnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cblxuZnVuY3Rpb24gUXVlcnkgKGFyZykge1xuXG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKGFyZyAmJiBhcmcubm9kZVR5cGUpIHtcbiAgICAgICAgdmFsdWUgPSBbYXJnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9ICcnICsgYXJnID09PSBhcmcgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFyZykgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJyYXlQcm90by5wdXNoLmFwcGx5KHRoaXMsIHZhbHVlKTtcbn1cblxuXG5RdWVyeS5wcm90b3R5cGUubGVuZ3RoID0gMDtcblxuXG5RdWVyeS5wcm90b3R5cGUuc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cblxuUXVlcnkucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZm5jKTtcbiAgICB9KTtcbn07XG5cblxuUXVlcnkucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZm5jKTtcbiAgICB9KTtcbn07XG5cblxuUXVlcnkucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbiAoaXRlcmF0b3IsIHZhbHVlKSB7XG4gICAgYXJyYXlQcm90by5mb3JFYWNoLmNhbGwodGhpcywgaXRlcmF0b3IsIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSAkO1xuIiwicmVxdWlyZSgnLi4vZG9tL3BvbHlmaWxscy9hbmltYXRpb24nKSh3aW5kb3cpO1xuXG5cbmZ1bmN0aW9uIEFuaW1hdGlvbkxvb3AgKGNhbGxiYWNrLCBhdXRvc3RhcnQpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICBpZiAoYXV0b3N0YXJ0IHx8IHRydWUpIHtcbiAgICAgICAgdGhpcy5yZXN1bWUoKTtcbiAgICB9XG59XG5cblxuQW5pbWF0aW9uTG9vcC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZik7XG59O1xuXG5cbkFuaW1hdGlvbkxvb3AucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmxhc3RUaW1lID0gMDtcbiAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRoaXMubG9vcCgpO1xufTtcblxuXG5BbmltYXRpb25Mb29wLnByb3RvdHlwZS5sb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMucmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgICAgIGlmIChzZWxmLnJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHZhciBkZWx0YVRpbWUgPSBNYXRoLm1pbigwLjUsICh0aW1lIC0gc2VsZi5sYXN0VGltZSkgKiAwLjAwMSk7XG4gICAgICAgICAgICBzZWxmLmxhc3RUaW1lID0gdGltZTtcbiAgICAgICAgICAgIHNlbGYuY2FsbGJhY2soZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIHNlbGYubG9vcCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uTG9vcDsiLCJyZXF1aXJlKCcuL2NhbnZhcy9kcmF3X3BhdGgnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvZHJhd19hcmMnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvZHJhd19jaXJjbGUnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvYW5pbWF0ZScpKENhbnZhcyk7XG5cblxuZnVuY3Rpb24gQ2FudmFzIChlbCkge1xuICAgIHRoaXMuY29udGV4dCA9IGVsLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5lbCA9IGVsO1xufVxuXG5cbkNhbnZhcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmVsLndpZHRoLCB0aGlzLmVsLmhlaWdodCk7XG59O1xuXG5cbkNhbnZhcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICB0aGlzWydkcmF3JyArIGVudGl0eS50eXBlXShlbnRpdHkpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENhbnZhcykge1xuXG4gICAgQ2FudmFzLnByb3RvdHlwZS5hbmltYXRlID0gYW5pbWF0ZTtcblxuICAgIHJldHVybiBDYW52YXM7XG59O1xuXG5cbnZhciBBbmltYXRpb25Mb29wID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9uX2xvb3AnKTtcblxuZnVuY3Rpb24gYW5pbWF0ZSAoZm5jKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmFuaW1hdGlvbkxvb3AgPSBuZXcgQW5pbWF0aW9uTG9vcChmdW5jdGlvbiAoZGVsdGFUaW1lKSB7XG4gICAgICAgIHNlbGYuY2xlYXIoKTtcbiAgICAgICAgZm5jLmNhbGwoc2VsZiwgZGVsdGFUaW1lKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ2FudmFzKSB7XG5cbiAgICBDYW52YXMucHJvdG90eXBlLmRyYXdBcmMgPSBkcmF3QXJjO1xuXG4gICAgcmV0dXJuIENhbnZhcztcbn07XG5cblxuZnVuY3Rpb24gZHJhd0FyYyAoYXJjKSB7XG5cbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0LmFyYyhhcmMueCwgYXJjLnksIGFyYy5yYWRpdXMsIGFyYy5zdGFydEFuZ2xlLCBhcmMuZW5kQW5nbGUsIGFyYy5hbnRpY2xvY2t3aXNlKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ2FudmFzKSB7XG5cbiAgICBDYW52YXMucHJvdG90eXBlLmRyYXdDaXJjbGUgPSBkcmF3Q2lyY2xlO1xuXG4gICAgcmV0dXJuIENhbnZhcztcbn07XG5cblxudmFyIEFyYyA9IHJlcXVpcmUoJy4uLy4uL2dlb21ldHJ5L2FyYycpO1xuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlIChjaXJjbGUpIHtcblxuICAgIHZhciBhcmMgPSBuZXcgQXJjKGNpcmNsZS54LCBjaXJjbGUueSwgY2lyY2xlLnJhZGl1cywgWzAsIDM2MF0pO1xuICAgIHRoaXMuZHJhd0FyYyhhcmMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENhbnZhcykge1xuXG4gICAgQ2FudmFzLnByb3RvdHlwZS5kcmF3UGF0aCA9IGRyYXdQYXRoO1xuXG4gICAgcmV0dXJuIENhbnZhcztcbn07XG5cblxuZnVuY3Rpb24gZHJhd1BhdGggKHBhdGgpIHtcblxuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBvaW50ID0gcGF0aC5wb2ludHNbaV07XG4gICAgICAgIHZhciBvcGVyYXRpb24gPSAhaSA/ICdtb3ZlVG8nIDogJ2xpbmVUbyc7XG4gICAgICAgIHRoaXMuY29udGV4dFtvcGVyYXRpb25dLmFwcGx5KHRoaXMuY29udGV4dCwgW3BvaW50LngsIHBvaW50LnldKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcblxufSIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBBcmMgKHgsIHksIHJhZGl1cywgYW5nbGVzLCBhbnRpQ2xvY2t3aXNlKSB7XG4gICAgdGhpcy50eXBlID0gJ0FyYyc7XG5cbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy5zdGFydEFuZ2xlID0gYW5nbGVzWzBdO1xuICAgIHRoaXMuZW5kQW5nbGUgPSBhbmdsZXNbMV07XG4gICAgdGhpcy5hbnRpQ2xvY2t3aXNlID0gYW50aUNsb2Nrd2lzZSB8fCBmYWxzZTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyYztcbiIsImZ1bmN0aW9uIFBhdGggKHBvaW50cykge1xuICAgIHRoaXMudHlwZSA9ICdQYXRoJztcbiAgICB0aGlzLnBvaW50cyA9IHBvaW50cyB8fCBbXTtcbn1cblxuXG5QYXRoLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9pbnRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwb2ludHMucHVzaCh0aGlzLnBvaW50c1tpXS5jbG9uZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBhdGgocG9pbnRzKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQYXRoO1xuIiwiZnVuY3Rpb24gUG9pbnQgKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG59XG5cblBvaW50LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcbiIsInZhciAkID0gcmVxdWlyZSgnLi9kb20vcXVlcnknKTtcbnZhciBDYW52YXMgPSByZXF1aXJlKCcuL2RyYXcvY2FudmFzJyk7XG52YXIgQW5pbWF0aW9uTG9vcCA9IHJlcXVpcmUoJy4vZHJhdy9hbmltYXRpb25fbG9vcCcpO1xudmFyIFBvaW50ID0gcmVxdWlyZSgnLi9nZW9tZXRyeS9wb2ludCcpO1xudmFyIFBhdGggPSByZXF1aXJlKCcuL2dlb21ldHJ5L3BhdGgnKTtcblxuXG52YXIgcGF0aDEgPSBuZXcgUGF0aChbXG4gICAgbmV3IFBvaW50KDAsIDIwKSxcbiAgICBuZXcgUG9pbnQoMCwgMTAwLCBbbmV3IFBvaW50KDUwLCAtNTApXSlcbl0pO1xuXG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW52YXMgPSBuZXcgQ2FudmFzKCQoJ2NhbnZhcycpWzBdKTtcblxuICAgIGNhbnZhcy5hbmltYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICBjYW52YXMuZHJhdyhwYXRoMSk7XG4gICAgfSk7XG5cbn0pOyJdfQ==
