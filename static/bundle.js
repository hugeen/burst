(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/core/def.js":[function(require,module,exports){
var hookCapabilities = require('./hook');
var slice = Array.prototype.slice;


var customizableAttrs = ['writable', 'configurable', 'enumerable'];


function defCapabilities (object) {

    hookCapabilities(object);


    Object.defineProperty(object, 'def', {
        value: function () {

            var args = formatArguments.apply(this, arguments);
            var settings = args.settings;
            var name = args.name;


            settings.value = function() {

                this.triggerHook('before', name, slice.call(arguments));
                var value = args.fnc.apply(this, arguments);
                this.triggerHook('after', name, slice.call(arguments));

                return value;

            };


            Object.defineProperty(this, name, settings);

            return this;

        }
    });


    return object;

}


function formatArguments () {

    var args = slice.call(arguments);

    var settings = {};

    if (typeof args[2] !== 'undefined') {
        settings = args[1].split(' ');

        for (var i = 0; i < settings.length; i++) {
            if (customizableAttrs.indexOf(settings[i]) !== -1) {
                settings[settings[i]] = true;
            }
        }
    }


    return {
        name: args[0],
        fnc: args[2] || args[1],
        settings: settings
    };

}


module.exports = defCapabilities;

},{"./hook":"/Users/cyrillebogaert/exp/full_capabilities/core/hook.js"}],"/Users/cyrillebogaert/exp/full_capabilities/core/event.js":[function(require,module,exports){
var slice = Array.prototype.slice;

function eventCapabilities (object) {

    if (typeof object.on !== 'undefined') {
        return object;
    }


    Object.defineProperty(object, 'on', {
        value: function(identifier, fnc) {
            findOrCreateListeners.call(this);

            this.listeners[identifier] = this.listeners[identifier] || [];
            this.listeners[identifier].push(fnc);

            return this;
        }
    });


    Object.defineProperty(object, 'removeListener', {
        value: function(identifier, fnc) {
            findOrCreateListeners.call(this);

            if (identifier in this.listeners) {
                this.listeners[identifier].splice(this.listeners[identifier].indexOf(fnc), 1);
            }

            return this;
        }
    });


    Object.defineProperty(object, 'emit', {
        value: function(identifier, fnc) {
            findOrCreateListeners.call(this);

            if (identifier in this.listeners) {
                for (var i = 0; i < this.listeners[identifier].length; i++) {
                    this.listeners[identifier][i].apply(this, slice.call(arguments, 1));
                }
            }

            return this;
        }
    });


    return object;

}


function findOrCreateListeners() {
    if (!('listeners' in this)) {
        Object.defineProperty(this, 'listeners', {
            value: {}
        });
    }
}


module.exports = eventCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/core/hook.js":[function(require,module,exports){
function hookCapabilities(object) {

    var hooks = {};


    Object.defineProperty(object, 'hook', {
        value: function(name, restrict) {
            hooks[name] = restrict ? [restrict] : ['after', 'before'];
        }
    });


    Object.defineProperty(object, 'triggerHook', {
        value: function(moment, name, args) {

            if (name in hooks) {
                if (hooks[name].indexOf(moment) !== -1) {
                    this.emit.apply(this, [moment + ' ' + name].concat(args));
                }
            }

        }
    });


    return object;

}


module.exports = hookCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/core/model.js":[function(require,module,exports){
var eventCapabilities = require('./event');
var defCapabilities = require('./def');
var tagCapabilities = require('./tag');

var slice = Array.prototype.slice;


function modelCapabilities (Model) {

    addCapabilities.call(Model, [
        eventCapabilities,
        defCapabilities,
        tagCapabilities
    ]);

    addCapabilities.call(Model.prototype, [
        eventCapabilities,
        defCapabilities
    ]);


    Model.hook('create');

    Model.def('create', function () {
        var instance = Object.create(Model.prototype);
        Model.apply(instance, slice.call(arguments));

        return instance;
    });


    return Model;

}


function addCapabilities(destinations) {
    for (var i in destinations) {
        destinations[i](this);
    }
}


module.exports = modelCapabilities;

},{"./def":"/Users/cyrillebogaert/exp/full_capabilities/core/def.js","./event":"/Users/cyrillebogaert/exp/full_capabilities/core/event.js","./tag":"/Users/cyrillebogaert/exp/full_capabilities/core/tag.js"}],"/Users/cyrillebogaert/exp/full_capabilities/core/tag.js":[function(require,module,exports){
function tagCapabilities (object) {

    var tags = {};


    Object.defineProperty(object, 'tag', {
        value: function (name, entity) {

            var tag = findOrCreateTag.call(this, tags, name);
            referenceTagName(name, entity);

            tag.push(entity);

            return this;
        }
    });


    Object.defineProperty(object, 'untag', {
        value: function (name, entity) {

            if (name in tags) {
                tags[name].splice(tags[name].indexOf(entity), 1);
                entity.taggedIn.splice(entity.taggedIn.indexOf(name), 1);
            }

            return this;
        }
    });


    return object;

}


function findOrCreateTag (tags, name) {

    if (!(name in tags)) {
        tags[name] = [];
        Object.defineProperty(this, name, {
            value: tags[name]
        });
    }

    return tags[name];

}


function referenceTagName (name, entity) {

    if (!('taggedIn' in entity)) {
        Object.defineProperty(entity, 'taggedIn', {
            value: []
        });
    }

    if (entity.taggedIn.indexOf(name) === -1) {
        entity.taggedIn.push(name);
    }

}


module.exports = tagCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/arc.js":[function(require,module,exports){
var slice = Array.prototype.slice;

require('../core/model')(Arc);


function Arc (x, y, radius, angles, antiClockwise) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = angles[0];
    this.endAngle = angles[1];
    this.antiClockwise = antiClockwise || false;
}


module.exports = Arc;

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js":[function(require,module,exports){
require('../core/model')(Canvas);
require('./canvas/draw_path')(Canvas);
require('./canvas/draw_path_debug')(Canvas);
require('./canvas/draw_arc')(Canvas);
require('./canvas/draw_circle')(Canvas);
require('./canvas/stylizing')(Canvas);


function Canvas (el) {
    this.context = el.getContext('2d');
    this.el = el;
}


(function (proto) {

    proto.def('clear', function () {
        this.context.clearRect(0, 0, this.el.width, this.el.height);
    });

})(Canvas.prototype);


module.exports = Canvas;

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js","./canvas/draw_arc":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_arc.js","./canvas/draw_circle":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_circle.js","./canvas/draw_path":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js","./canvas/draw_path_debug":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path_debug.js","./canvas/stylizing":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/stylizing.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_arc.js":[function(require,module,exports){
function drawArcCapabilities (Canvas) {

    (function (proto) {

        proto.def('drawArc', function (arc) {

            this.context.beginPath();

            this.context.arc(arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle, arc.anticlockwise);

            this.context.stroke();

            return this;

        });

    })(Canvas.prototype);

}


module.exports = drawArcCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_circle.js":[function(require,module,exports){
var Arc = require('../arc');

function drawCircleCapabilities (Canvas) {

    (function (proto) {

        proto.def('drawCircle', function (circle) {

            var arc = new Arc(circle.x, circle.y, circle.radius, [0, 360]);
            this.drawArc(arc);

            return this;

        });

    })(Canvas.prototype);

}


module.exports = drawCircleCapabilities;

},{"../arc":"/Users/cyrillebogaert/exp/full_capabilities/draw/arc.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js":[function(require,module,exports){
function drawPathCapabilities (Canvas) {

    (function (proto) {

        proto.def('drawPath', function (path) {

            this.context.beginPath();

            for (var i = 0; i < path.segments.length; i++) {
                point = path.segments[i];

                var operation = selectDrawingOperation(point, i);
                var drawingArgs = getDrawingArgs.call(point, operation);

                this.context[operation].apply(this.context, drawingArgs);
            }

            this.context.stroke();

            return this;

        });

    })(Canvas.prototype);

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


function selectDrawingOperation (point, index) {
    var operation = 'moveTo';

    if (index !== 0) {
        switch (point.controlPoints.length) {
            case 0:
                operation = 'lineTo';
                break;
            case 1:
                operation = 'quadraticCurveTo';
                break;
            case 2:
                operation = 'bezierCurveTo';
                break;
        }
    }
    return operation;
}


module.exports = drawPathCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path_debug.js":[function(require,module,exports){
var slice = Array.prototype.slice;


function debugDrawPathCapabilities (Canvas) {

    (function (proto) {

        proto.hook('drawPath', 'after');

        proto.on('after drawPath', function(path) {
            console.log('drawPath', path);
        });

    })(Canvas.prototype);

}


module.exports = debugDrawPathCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/stylizing.js":[function(require,module,exports){
function stylizingCapabilities (Canvas) {

    (function (proto) {



    })(Canvas.prototype);

}

module.exports = stylizingCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/circle.js":[function(require,module,exports){
var slice = Array.prototype.slice;

require('../core/model')(Circle);


function Circle (x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}


module.exports = Circle;

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/dom.js":[function(require,module,exports){
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
var push = arrayProto.push;
var forEach = arrayProto.forEach;


function $ (arg) {

    var value;

    if (typeof arg === 'function') {
        if (document.readyState === 'complete') {
            value = arg();
        } else {
            value = $(document).on('DOMContentLoaded', arg);
        }
    } else {
        value = new QuerySelector(arg);
    }

    return value;

}


function QuerySelector (arg) {

    var value;

    if (arg && arg.nodeType) {
        value = [arg];
    } else {
        value = '' + arg === arg ? document.querySelectorAll(arg) : undefined;
    }

    push.apply(this, value);

}


(function (proto) {

    proto.length = 0;

    proto.splice = splice;


    proto.on = function (name, fnc) {
        return this.each(function (el) {
            el.addEventListener(name, fnc);
        });
    };


    proto.removeListener = function (name, fnc) {
        return this.each(function (el) {
            el.removeEventListener(name, fnc);
        });
    };


    proto.each = function (iterator, value) {
        forEach.call(this, iterator, value);
        return this;
    };

})(QuerySelector.prototype);


module.exports = $;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/path.js":[function(require,module,exports){
var slice = Array.prototype.slice;

require('../core/model')(Path);


function Path () {
    this.segments = [];
}


(function (proto) {

    proto.def('add', function () {

        var points = slice.call(arguments);
        for (var i = 0; i < points.length; i ++) {
            this.segments.push(points[i]);
        }

    });

})(Path.prototype);


module.exports = Path;

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/point.js":[function(require,module,exports){
var slice = Array.prototype.slice;

require('../core/model')(Point);


function Point (x, y, controlPoints) {
    this.x = x;
    this.y = y;
    this.controlPoints = [];

    this.addControlPoints(controlPoints || []);
}


(function (proto) {

    proto.def('addControlPoints', function (controlPoints) {

        for (var i = 0; i < controlPoints.length; i++) {
            this.controlPoints[i] = Point.create.apply(Point, controlPoints[i]);
        }

    });

})(Point.prototype);


module.exports = Point;

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/main.js":[function(require,module,exports){
var $ = require('./draw/dom');
var Canvas = require('./draw/canvas');
var Path = require('./draw/path');
var Point = require('./draw/point');
var Circle = require('./draw/circle');

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

var circle = Circle.create(20, 20, 10);

$(function () {
    var canvas = Canvas.create($('canvas')[0]);
    canvas.drawPath(path);
    canvas.drawCircle(circle);
});

},{"./draw/canvas":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./draw/circle":"/Users/cyrillebogaert/exp/full_capabilities/draw/circle.js","./draw/dom":"/Users/cyrillebogaert/exp/full_capabilities/draw/dom.js","./draw/path":"/Users/cyrillebogaert/exp/full_capabilities/draw/path.js","./draw/point":"/Users/cyrillebogaert/exp/full_capabilities/draw/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL2RlZi5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL21vZGVsLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL3RhZy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9hcmMuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy9kcmF3X2FyYy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvZHJhd19jaXJjbGUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzL2RyYXdfcGF0aC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvZHJhd19wYXRoX2RlYnVnLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy9zdHlsaXppbmcuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2lyY2xlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2RvbS5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9wYXRoLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L3BvaW50LmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgaG9va0NhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vaG9vaycpO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cbnZhciBjdXN0b21pemFibGVBdHRycyA9IFsnd3JpdGFibGUnLCAnY29uZmlndXJhYmxlJywgJ2VudW1lcmFibGUnXTtcblxuXG5mdW5jdGlvbiBkZWZDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgaG9va0NhcGFiaWxpdGllcyhvYmplY3QpO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZGVmJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgYXJncyA9IGZvcm1hdEFyZ3VtZW50cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIHNldHRpbmdzID0gYXJncy5zZXR0aW5ncztcbiAgICAgICAgICAgIHZhciBuYW1lID0gYXJncy5uYW1lO1xuXG5cbiAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJIb29rKCdiZWZvcmUnLCBuYW1lLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyZ3MuZm5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VySG9vaygnYWZ0ZXInLCBuYW1lLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCBzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3VtZW50cyAoKSB7XG5cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmdzWzJdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZXR0aW5ncyA9IGFyZ3NbMV0uc3BsaXQoJyAnKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3VzdG9taXphYmxlQXR0cnMuaW5kZXhPZihzZXR0aW5nc1tpXSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Nbc2V0dGluZ3NbaV1dID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYXJnc1swXSxcbiAgICAgICAgZm5jOiBhcmdzWzJdIHx8IGFyZ3NbMV0sXG4gICAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xuICAgIH07XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZkNhcGFiaWxpdGllcztcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gZXZlbnRDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBvYmplY3Qub24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnb24nLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGZpbmRPckNyZWF0ZUxpc3RlbmVycy5jYWxsKHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXSA9IHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0ucHVzaChmbmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAncmVtb3ZlTGlzdGVuZXInLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGZpbmRPckNyZWF0ZUxpc3RlbmVycy5jYWxsKHRoaXMpO1xuXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLnNwbGljZSh0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5pbmRleE9mKGZuYyksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZW1pdCcsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgZmluZE9yQ3JlYXRlTGlzdGVuZXJzLmNhbGwodGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXVtpXS5hcHBseSh0aGlzLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZpbmRPckNyZWF0ZUxpc3RlbmVycygpIHtcbiAgICBpZiAoISgnbGlzdGVuZXJzJyBpbiB0aGlzKSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2xpc3RlbmVycycsIHtcbiAgICAgICAgICAgIHZhbHVlOiB7fVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudENhcGFiaWxpdGllcztcbiIsImZ1bmN0aW9uIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KSB7XG5cbiAgICB2YXIgaG9va3MgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2hvb2snLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihuYW1lLCByZXN0cmljdCkge1xuICAgICAgICAgICAgaG9va3NbbmFtZV0gPSByZXN0cmljdCA/IFtyZXN0cmljdF0gOiBbJ2FmdGVyJywgJ2JlZm9yZSddO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICd0cmlnZ2VySG9vaycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKG1vbWVudCwgbmFtZSwgYXJncykge1xuXG4gICAgICAgICAgICBpZiAobmFtZSBpbiBob29rcykge1xuICAgICAgICAgICAgICAgIGlmIChob29rc1tuYW1lXS5pbmRleE9mKG1vbWVudCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBbbW9tZW50ICsgJyAnICsgbmFtZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBob29rQ2FwYWJpbGl0aWVzO1xuIiwidmFyIGV2ZW50Q2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ldmVudCcpO1xudmFyIGRlZkNhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vZGVmJyk7XG52YXIgdGFnQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi90YWcnKTtcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cbmZ1bmN0aW9uIG1vZGVsQ2FwYWJpbGl0aWVzIChNb2RlbCkge1xuXG4gICAgYWRkQ2FwYWJpbGl0aWVzLmNhbGwoTW9kZWwsIFtcbiAgICAgICAgZXZlbnRDYXBhYmlsaXRpZXMsXG4gICAgICAgIGRlZkNhcGFiaWxpdGllcyxcbiAgICAgICAgdGFnQ2FwYWJpbGl0aWVzXG4gICAgXSk7XG5cbiAgICBhZGRDYXBhYmlsaXRpZXMuY2FsbChNb2RlbC5wcm90b3R5cGUsIFtcbiAgICAgICAgZXZlbnRDYXBhYmlsaXRpZXMsXG4gICAgICAgIGRlZkNhcGFiaWxpdGllc1xuICAgIF0pO1xuXG5cbiAgICBNb2RlbC5ob29rKCdjcmVhdGUnKTtcblxuICAgIE1vZGVsLmRlZignY3JlYXRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKE1vZGVsLnByb3RvdHlwZSk7XG4gICAgICAgIE1vZGVsLmFwcGx5KGluc3RhbmNlLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIE1vZGVsO1xuXG59XG5cblxuZnVuY3Rpb24gYWRkQ2FwYWJpbGl0aWVzKGRlc3RpbmF0aW9ucykge1xuICAgIGZvciAodmFyIGkgaW4gZGVzdGluYXRpb25zKSB7XG4gICAgICAgIGRlc3RpbmF0aW9uc1tpXSh0aGlzKTtcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBtb2RlbENhcGFiaWxpdGllcztcbiIsImZ1bmN0aW9uIHRhZ0NhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICB2YXIgdGFncyA9IHt9O1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndGFnJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKG5hbWUsIGVudGl0eSkge1xuXG4gICAgICAgICAgICB2YXIgdGFnID0gZmluZE9yQ3JlYXRlVGFnLmNhbGwodGhpcywgdGFncywgbmFtZSk7XG4gICAgICAgICAgICByZWZlcmVuY2VUYWdOYW1lKG5hbWUsIGVudGl0eSk7XG5cbiAgICAgICAgICAgIHRhZy5wdXNoKGVudGl0eSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICd1bnRhZycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChuYW1lLCBlbnRpdHkpIHtcblxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gdGFncykge1xuICAgICAgICAgICAgICAgIHRhZ3NbbmFtZV0uc3BsaWNlKHRhZ3NbbmFtZV0uaW5kZXhPZihlbnRpdHkpLCAxKTtcbiAgICAgICAgICAgICAgICBlbnRpdHkudGFnZ2VkSW4uc3BsaWNlKGVudGl0eS50YWdnZWRJbi5pbmRleE9mKG5hbWUpLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZpbmRPckNyZWF0ZVRhZyAodGFncywgbmFtZSkge1xuXG4gICAgaWYgKCEobmFtZSBpbiB0YWdzKSkge1xuICAgICAgICB0YWdzW25hbWVdID0gW107XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgICAgICB2YWx1ZTogdGFnc1tuYW1lXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFnc1tuYW1lXTtcblxufVxuXG5cbmZ1bmN0aW9uIHJlZmVyZW5jZVRhZ05hbWUgKG5hbWUsIGVudGl0eSkge1xuXG4gICAgaWYgKCEoJ3RhZ2dlZEluJyBpbiBlbnRpdHkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbnRpdHksICd0YWdnZWRJbicsIHtcbiAgICAgICAgICAgIHZhbHVlOiBbXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZW50aXR5LnRhZ2dlZEluLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICAgIGVudGl0eS50YWdnZWRJbi5wdXNoKG5hbWUpO1xuICAgIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gdGFnQ2FwYWJpbGl0aWVzO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5yZXF1aXJlKCcuLi9jb3JlL21vZGVsJykoQXJjKTtcblxuXG5mdW5jdGlvbiBBcmMgKHgsIHksIHJhZGl1cywgYW5nbGVzLCBhbnRpQ2xvY2t3aXNlKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgIHRoaXMuc3RhcnRBbmdsZSA9IGFuZ2xlc1swXTtcbiAgICB0aGlzLmVuZEFuZ2xlID0gYW5nbGVzWzFdO1xuICAgIHRoaXMuYW50aUNsb2Nrd2lzZSA9IGFudGlDbG9ja3dpc2UgfHwgZmFsc2U7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmM7XG4iLCJyZXF1aXJlKCcuLi9jb3JlL21vZGVsJykoQ2FudmFzKTtcbnJlcXVpcmUoJy4vY2FudmFzL2RyYXdfcGF0aCcpKENhbnZhcyk7XG5yZXF1aXJlKCcuL2NhbnZhcy9kcmF3X3BhdGhfZGVidWcnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvZHJhd19hcmMnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvZHJhd19jaXJjbGUnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvc3R5bGl6aW5nJykoQ2FudmFzKTtcblxuXG5mdW5jdGlvbiBDYW52YXMgKGVsKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gZWwuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmVsID0gZWw7XG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8uZGVmKCdjbGVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmVsLndpZHRoLCB0aGlzLmVsLmhlaWdodCk7XG4gICAgfSk7XG5cbn0pKENhbnZhcy5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzO1xuIiwiZnVuY3Rpb24gZHJhd0FyY0NhcGFiaWxpdGllcyAoQ2FudmFzKSB7XG5cbiAgICAoZnVuY3Rpb24gKHByb3RvKSB7XG5cbiAgICAgICAgcHJvdG8uZGVmKCdkcmF3QXJjJywgZnVuY3Rpb24gKGFyYykge1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hcmMoYXJjLngsIGFyYy55LCBhcmMucmFkaXVzLCBhcmMuc3RhcnRBbmdsZSwgYXJjLmVuZEFuZ2xlLCBhcmMuYW50aWNsb2Nrd2lzZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KShDYW52YXMucHJvdG90eXBlKTtcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZHJhd0FyY0NhcGFiaWxpdGllcztcbiIsInZhciBBcmMgPSByZXF1aXJlKCcuLi9hcmMnKTtcblxuZnVuY3Rpb24gZHJhd0NpcmNsZUNhcGFiaWxpdGllcyAoQ2FudmFzKSB7XG5cbiAgICAoZnVuY3Rpb24gKHByb3RvKSB7XG5cbiAgICAgICAgcHJvdG8uZGVmKCdkcmF3Q2lyY2xlJywgZnVuY3Rpb24gKGNpcmNsZSkge1xuXG4gICAgICAgICAgICB2YXIgYXJjID0gbmV3IEFyYyhjaXJjbGUueCwgY2lyY2xlLnksIGNpcmNsZS5yYWRpdXMsIFswLCAzNjBdKTtcbiAgICAgICAgICAgIHRoaXMuZHJhd0FyYyhhcmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICB9KTtcblxuICAgIH0pKENhbnZhcy5wcm90b3R5cGUpO1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBkcmF3Q2lyY2xlQ2FwYWJpbGl0aWVzO1xuIiwiZnVuY3Rpb24gZHJhd1BhdGhDYXBhYmlsaXRpZXMgKENhbnZhcykge1xuXG4gICAgKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgICAgIHByb3RvLmRlZignZHJhd1BhdGgnLCBmdW5jdGlvbiAocGF0aCkge1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5zZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBvaW50ID0gcGF0aC5zZWdtZW50c1tpXTtcblxuICAgICAgICAgICAgICAgIHZhciBvcGVyYXRpb24gPSBzZWxlY3REcmF3aW5nT3BlcmF0aW9uKHBvaW50LCBpKTtcbiAgICAgICAgICAgICAgICB2YXIgZHJhd2luZ0FyZ3MgPSBnZXREcmF3aW5nQXJncy5jYWxsKHBvaW50LCBvcGVyYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0W29wZXJhdGlvbl0uYXBwbHkodGhpcy5jb250ZXh0LCBkcmF3aW5nQXJncyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KShDYW52YXMucHJvdG90eXBlKTtcblxufVxuXG5cbmZ1bmN0aW9uIGdldERyYXdpbmdBcmdzIChvcGVyYXRpb24pIHtcblxuICAgIHZhciBwb2ludCA9IHRoaXM7XG5cbiAgICB2YXIgb3BlcmF0aW9ucyA9IHtcbiAgICAgICAgbW92ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW3BvaW50LngsIHBvaW50LnldO1xuICAgICAgICB9LFxuICAgICAgICBiZXppZXJDdXJ2ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1sxXS54LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMV0ueSxcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0sXG4gICAgICAgIHF1YWRyYXRpY0N1cnZlVG86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1swXS54LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueSxcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgb3BlcmF0aW9ucy5saW5lVG8gPSBvcGVyYXRpb25zLm1vdmVUbztcblxuICAgIHJldHVybiBvcGVyYXRpb25zW29wZXJhdGlvbl0oKTtcbn1cblxuXG5mdW5jdGlvbiBzZWxlY3REcmF3aW5nT3BlcmF0aW9uIChwb2ludCwgaW5kZXgpIHtcbiAgICB2YXIgb3BlcmF0aW9uID0gJ21vdmVUbyc7XG5cbiAgICBpZiAoaW5kZXggIT09IDApIHtcbiAgICAgICAgc3dpdGNoIChwb2ludC5jb250cm9sUG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9ICdsaW5lVG8nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9ICdxdWFkcmF0aWNDdXJ2ZVRvJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPSAnYmV6aWVyQ3VydmVUbyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9wZXJhdGlvbjtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRyYXdQYXRoQ2FwYWJpbGl0aWVzO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cbmZ1bmN0aW9uIGRlYnVnRHJhd1BhdGhDYXBhYmlsaXRpZXMgKENhbnZhcykge1xuXG4gICAgKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgICAgIHByb3RvLmhvb2soJ2RyYXdQYXRoJywgJ2FmdGVyJyk7XG5cbiAgICAgICAgcHJvdG8ub24oJ2FmdGVyIGRyYXdQYXRoJywgZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RyYXdQYXRoJywgcGF0aCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSkoQ2FudmFzLnByb3RvdHlwZSk7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYnVnRHJhd1BhdGhDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiBzdHlsaXppbmdDYXBhYmlsaXRpZXMgKENhbnZhcykge1xuXG4gICAgKGZ1bmN0aW9uIChwcm90bykge1xuXG5cblxuICAgIH0pKENhbnZhcy5wcm90b3R5cGUpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGl6aW5nQ2FwYWJpbGl0aWVzO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5yZXF1aXJlKCcuLi9jb3JlL21vZGVsJykoQ2lyY2xlKTtcblxuXG5mdW5jdGlvbiBDaXJjbGUgKHgsIHksIHJhZGl1cykge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENpcmNsZTtcbiIsInZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xudmFyIHB1c2ggPSBhcnJheVByb3RvLnB1c2g7XG52YXIgZm9yRWFjaCA9IGFycmF5UHJvdG8uZm9yRWFjaDtcblxuXG5mdW5jdGlvbiAkIChhcmcpIHtcblxuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmICh0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFyZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSAkKGRvY3VtZW50KS5vbignRE9NQ29udGVudExvYWRlZCcsIGFyZyk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG5ldyBRdWVyeVNlbGVjdG9yKGFyZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuXG59XG5cblxuZnVuY3Rpb24gUXVlcnlTZWxlY3RvciAoYXJnKSB7XG5cbiAgICB2YXIgdmFsdWU7XG5cbiAgICBpZiAoYXJnICYmIGFyZy5ub2RlVHlwZSkge1xuICAgICAgICB2YWx1ZSA9IFthcmddO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gJycgKyBhcmcgPT09IGFyZyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYXJnKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwdXNoLmFwcGx5KHRoaXMsIHZhbHVlKTtcblxufVxuXG5cbihmdW5jdGlvbiAocHJvdG8pIHtcblxuICAgIHByb3RvLmxlbmd0aCA9IDA7XG5cbiAgICBwcm90by5zcGxpY2UgPSBzcGxpY2U7XG5cblxuICAgIHByb3RvLm9uID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmbmMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChuYW1lLCBmbmMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZm5jKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgcHJvdG8uZWFjaCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdmFsdWUpIHtcbiAgICAgICAgZm9yRWFjaC5jYWxsKHRoaXMsIGl0ZXJhdG9yLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbn0pKFF1ZXJ5U2VsZWN0b3IucHJvdG90eXBlKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnJlcXVpcmUoJy4uL2NvcmUvbW9kZWwnKShQYXRoKTtcblxuXG5mdW5jdGlvbiBQYXRoICgpIHtcbiAgICB0aGlzLnNlZ21lbnRzID0gW107XG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8uZGVmKCdhZGQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHBvaW50cyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICB0aGlzLnNlZ21lbnRzLnB1c2gocG9pbnRzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbn0pKFBhdGgucHJvdG90eXBlKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGg7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnJlcXVpcmUoJy4uL2NvcmUvbW9kZWwnKShQb2ludCk7XG5cblxuZnVuY3Rpb24gUG9pbnQgKHgsIHksIGNvbnRyb2xQb2ludHMpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5jb250cm9sUG9pbnRzID0gW107XG5cbiAgICB0aGlzLmFkZENvbnRyb2xQb2ludHMoY29udHJvbFBvaW50cyB8fCBbXSk7XG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8uZGVmKCdhZGRDb250cm9sUG9pbnRzJywgZnVuY3Rpb24gKGNvbnRyb2xQb2ludHMpIHtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xQb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbFBvaW50c1tpXSA9IFBvaW50LmNyZWF0ZS5hcHBseShQb2ludCwgY29udHJvbFBvaW50c1tpXSk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59KShQb2ludC5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4vZHJhdy9kb20nKTtcbnZhciBDYW52YXMgPSByZXF1aXJlKCcuL2RyYXcvY2FudmFzJyk7XG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vZHJhdy9wYXRoJyk7XG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL2RyYXcvcG9pbnQnKTtcbnZhciBDaXJjbGUgPSByZXF1aXJlKCcuL2RyYXcvY2lyY2xlJyk7XG5cbnZhciBwYXRoID0gUGF0aC5jcmVhdGUoKTtcblxucGF0aC5hZGQoXG4gICAgUG9pbnQuY3JlYXRlKDc1LCA0MCksXG4gICAgUG9pbnQuY3JlYXRlKDUwLCAyNSwgW1xuICAgICAgICBbNzUsIDM3XSxcbiAgICAgICAgWzcwLCAyNV1cbiAgICBdKSxcbiAgICBQb2ludC5jcmVhdGUoMjAsIDYyLjUsIFtcbiAgICAgICAgWzIwLCAyNV0sXG4gICAgICAgIFsyMCwgNjIuNV1cbiAgICBdKSxcbiAgICBQb2ludC5jcmVhdGUoNzUsIDEyMCwgW1xuICAgICAgICBbMjAsIDgwXSxcbiAgICAgICAgWzQwLCAxMDJdXG4gICAgXSksXG4gICAgUG9pbnQuY3JlYXRlKDEzMCwgNjIuNSwgW1xuICAgICAgICBbMTEwLCAxMDJdLFxuICAgICAgICBbMTMwLCA4MF1cbiAgICBdKSxcbiAgICBQb2ludC5jcmVhdGUoMTAwLCAyNSwgW1xuICAgICAgICBbMTMwLCA2Mi41XSxcbiAgICAgICAgWzEzMCwgMjVdXG4gICAgXSksXG4gICAgUG9pbnQuY3JlYXRlKDc1LCA0MCwgW1xuICAgICAgICBbODUsIDI1XSxcbiAgICAgICAgWzc1LCAzN11cbiAgICBdKVxuKTtcblxudmFyIGNpcmNsZSA9IENpcmNsZS5jcmVhdGUoMjAsIDIwLCAxMCk7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW52YXMgPSBDYW52YXMuY3JlYXRlKCQoJ2NhbnZhcycpWzBdKTtcbiAgICBjYW52YXMuZHJhd1BhdGgocGF0aCk7XG4gICAgY2FudmFzLmRyYXdDaXJjbGUoY2lyY2xlKTtcbn0pO1xuIl19
