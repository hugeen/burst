(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/core/def.js":[function(require,module,exports){
var hookCapabilities = require('./hook');
var slice = Array.prototype.slice;


var customizableAttrs = ['writable', 'configurable', 'enumerable'];


function defCapabilities (object) {

    hookCapabilities(object);


    var methods = {};


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
            methods[name] = args.fnc;


            return this;

        }
    });


    Object.defineProperty(object, 'silentCall', {
        value: function() {
            var args = slice.call(arguments);
            var name = args.shift();

            methods[name].apply(this, args);
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


function on (identifier, fnc) {
    findOrCreateListeners.call(this);

    this.listeners[identifier] = this.listeners[identifier] || [];
    this.listeners[identifier].push(fnc);

    return this;
}


function removeListener (identifier, fnc) {
    findOrCreateListeners.call(this);

    if (identifier in this.listeners) {
        this.listeners[identifier].splice(this.listeners[identifier].indexOf(fnc), 1);
    }

    return this;
}


function emit (identifier, fnc) {
    findOrCreateListeners.call(this);

    if (identifier in this.listeners) {
        for (var i = 0; i < this.listeners[identifier].length; i++) {
            this.listeners[identifier][i].apply(this, slice.call(arguments, 1));
        }
    }

    return this;
}


function logEvent (eventName) {
    this.on(eventName, function() {
        console.log.apply(null, [eventName].concat(slice.call(arguments)));
    });
}


function findOrCreateListeners() {
    if (!('listeners' in this)) {
        Object.defineProperty(this, 'listeners', {
            value: {}
        });
    }
}


function def (name, fnc) {
    Object.defineProperty(this, name, {
        value: fnc
    });
}


module.exports = function (object) {

    if ('on' in object) {
        return object;
    }


    def.call(object, 'on', on);
    def.call(object, 'emit', emit);
    def.call(object, 'removeListener', removeListener);
    def.call(object, 'logEvent', logEvent);


    return object;

};

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


    Object.defineProperty(object, 'logHook', {
        value: function(name) {

            this.hook(name);
            var moments = hooks[name];
            for (var i = 0; i < moments.length; i ++) {
                this.logEvent(moments[i] + ' ' + name);
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

},{}],"/Users/cyrillebogaert/exp/full_capabilities/dom/dom.js":[function(require,module,exports){
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

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/arc.js":[function(require,module,exports){
var slice = Array.prototype.slice;

require('../core/model')(Arc);


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

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js":[function(require,module,exports){
require('../core/model')(Canvas);
require('./canvas/draw_path')(Canvas);
require('./canvas/draw_arc')(Canvas);
require('./canvas/draw_circle')(Canvas);
require('./canvas/stylizing')(Canvas);


function Canvas (el) {
    this.context = el.getContext('2d');
    this.el = el;
}


function clear () {
    this.context.clearRect(0, 0, this.el.width, this.el.height);
}


function draw (entity) {
    this['draw' + entity.type](entity);
}


(function (proto) {

    proto.hook('draw');
    proto.logHook('draw');

    proto.def('clear', clear);
    proto.def('draw', draw);

})(Canvas.prototype);


module.exports = Canvas;

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js","./canvas/draw_arc":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_arc.js","./canvas/draw_circle":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_circle.js","./canvas/draw_path":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js","./canvas/stylizing":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/stylizing.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_arc.js":[function(require,module,exports){
function drawArc (arc) {

    this.context.beginPath();

    this.context.arc(arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle, arc.anticlockwise);

    this.context.stroke();

    return this;

}


module.exports = function (Canvas) {

    (function (proto) {

        proto.def('drawArc', drawArc);

    })(Canvas.prototype);

};

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_circle.js":[function(require,module,exports){
var Arc = require('../arc');


function drawCircle (circle) {

    var arc = new Arc(circle.x, circle.y, circle.radius, [0, 360]);
    this.drawArc(arc);

    return this;

}


module.exports = function (Canvas) {

    (function (proto) {

        proto.def('drawCircle', drawCircle);

    })(Canvas.prototype);

};

},{"../arc":"/Users/cyrillebogaert/exp/full_capabilities/draw/arc.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js":[function(require,module,exports){
function drawPath (path) {

    this.context.beginPath();

    for (var i = 0; i < path.segments.length; i++) {
        point = path.segments[i];

        var operation = selectDrawingOperation(point, i);
        var drawingArgs = getDrawingArgs.call(point, operation);

        this.context[operation].apply(this.context, drawingArgs);
    }

    this.context.stroke();

    return this;

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


module.exports = function (Canvas) {

    (function (proto) {

        proto.def('drawPath', drawPath);

    })(Canvas.prototype);

};

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/stylizing.js":[function(require,module,exports){
module.exports = function (Canvas) {

    (function (proto) {



    })(Canvas.prototype);

};

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/circle.js":[function(require,module,exports){
var slice = Array.prototype.slice;

require('../core/model')(Circle);


function Circle (x, y, radius) {
    this.type = 'Circle';

    this.x = x;
    this.y = y;
    this.radius = radius;
}


module.exports = Circle;

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/path.js":[function(require,module,exports){
var slice = Array.prototype.slice;

require('../core/model')(Path);


function Path () {
    this.type = 'Path';
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
var $ = require('./dom/dom');
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
    canvas.draw(path);
    // canvas.draw(circle);
    canvas.silentCall('draw', circle);
});

},{"./dom/dom":"/Users/cyrillebogaert/exp/full_capabilities/dom/dom.js","./draw/canvas":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./draw/circle":"/Users/cyrillebogaert/exp/full_capabilities/draw/circle.js","./draw/path":"/Users/cyrillebogaert/exp/full_capabilities/draw/path.js","./draw/point":"/Users/cyrillebogaert/exp/full_capabilities/draw/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL2RlZi5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL21vZGVsLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL3RhZy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZG9tL2RvbS5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9hcmMuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NhbnZhcy9kcmF3X2FyYy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvZHJhd19jaXJjbGUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzL2RyYXdfcGF0aC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMvc3R5bGl6aW5nLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L2NpcmNsZS5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9wYXRoLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L3BvaW50LmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGhvb2tDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2hvb2snKTtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG52YXIgY3VzdG9taXphYmxlQXR0cnMgPSBbJ3dyaXRhYmxlJywgJ2NvbmZpZ3VyYWJsZScsICdlbnVtZXJhYmxlJ107XG5cblxuZnVuY3Rpb24gZGVmQ2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KTtcblxuXG4gICAgdmFyIG1ldGhvZHMgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2RlZicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBmb3JtYXRBcmd1bWVudHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IGFyZ3Muc2V0dGluZ3M7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGFyZ3MubmFtZTtcblxuXG4gICAgICAgICAgICBzZXR0aW5ncy52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VySG9vaygnYmVmb3JlJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzLmZuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckhvb2soJ2FmdGVyJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgbWV0aG9kc1tuYW1lXSA9IGFyZ3MuZm5jO1xuXG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3NpbGVudENhbGwnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBhcmdzLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgIG1ldGhvZHNbbmFtZV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3VtZW50cyAoKSB7XG5cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmdzWzJdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZXR0aW5ncyA9IGFyZ3NbMV0uc3BsaXQoJyAnKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3VzdG9taXphYmxlQXR0cnMuaW5kZXhPZihzZXR0aW5nc1tpXSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Nbc2V0dGluZ3NbaV1dID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYXJnc1swXSxcbiAgICAgICAgZm5jOiBhcmdzWzJdIHx8IGFyZ3NbMV0sXG4gICAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xuICAgIH07XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZkNhcGFiaWxpdGllcztcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBvbiAoaWRlbnRpZmllciwgZm5jKSB7XG4gICAgZmluZE9yQ3JlYXRlTGlzdGVuZXJzLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXSA9IHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdIHx8IFtdO1xuICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLnB1c2goZm5jKTtcblxuICAgIHJldHVybiB0aGlzO1xufVxuXG5cbmZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyIChpZGVudGlmaWVyLCBmbmMpIHtcbiAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgIGlmIChpZGVudGlmaWVyIGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLnNwbGljZSh0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5pbmRleE9mKGZuYyksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufVxuXG5cbmZ1bmN0aW9uIGVtaXQgKGlkZW50aWZpZXIsIGZuYykge1xuICAgIGZpbmRPckNyZWF0ZUxpc3RlbmVycy5jYWxsKHRoaXMpO1xuXG4gICAgaWYgKGlkZW50aWZpZXIgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl1baV0uYXBwbHkodGhpcywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufVxuXG5cbmZ1bmN0aW9uIGxvZ0V2ZW50IChldmVudE5hbWUpIHtcbiAgICB0aGlzLm9uKGV2ZW50TmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KG51bGwsIFtldmVudE5hbWVdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9KTtcbn1cblxuXG5mdW5jdGlvbiBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKCEoJ2xpc3RlbmVycycgaW4gdGhpcykpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdsaXN0ZW5lcnMnLCB7XG4gICAgICAgICAgICB2YWx1ZToge31cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGRlZiAobmFtZSwgZm5jKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgdmFsdWU6IGZuY1xuICAgIH0pO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCkge1xuXG4gICAgaWYgKCdvbicgaW4gb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG5cbiAgICBkZWYuY2FsbChvYmplY3QsICdvbicsIG9uKTtcbiAgICBkZWYuY2FsbChvYmplY3QsICdlbWl0JywgZW1pdCk7XG4gICAgZGVmLmNhbGwob2JqZWN0LCAncmVtb3ZlTGlzdGVuZXInLCByZW1vdmVMaXN0ZW5lcik7XG4gICAgZGVmLmNhbGwob2JqZWN0LCAnbG9nRXZlbnQnLCBsb2dFdmVudCk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn07XG4iLCJmdW5jdGlvbiBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCkge1xuXG4gICAgdmFyIGhvb2tzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdob29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgcmVzdHJpY3QpIHtcbiAgICAgICAgICAgIGhvb2tzW25hbWVdID0gcmVzdHJpY3QgPyBbcmVzdHJpY3RdIDogWydhZnRlcicsICdiZWZvcmUnXTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndHJpZ2dlckhvb2snLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihtb21lbnQsIG5hbWUsIGFyZ3MpIHtcblxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gaG9va3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoaG9va3NbbmFtZV0uaW5kZXhPZihtb21lbnQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQuYXBwbHkodGhpcywgW21vbWVudCArICcgJyArIG5hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2xvZ0hvb2snLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihuYW1lKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaG9vayhuYW1lKTtcbiAgICAgICAgICAgIHZhciBtb21lbnRzID0gaG9va3NbbmFtZV07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vbWVudHMubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dFdmVudChtb21lbnRzW2ldICsgJyAnICsgbmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaG9va0NhcGFiaWxpdGllcztcbiIsInZhciBldmVudENhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vZXZlbnQnKTtcbnZhciBkZWZDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2RlZicpO1xudmFyIHRhZ0NhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vdGFnJyk7XG5cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBtb2RlbENhcGFiaWxpdGllcyAoTW9kZWwpIHtcblxuICAgIGFkZENhcGFiaWxpdGllcy5jYWxsKE1vZGVsLCBbXG4gICAgICAgIGV2ZW50Q2FwYWJpbGl0aWVzLFxuICAgICAgICBkZWZDYXBhYmlsaXRpZXMsXG4gICAgICAgIHRhZ0NhcGFiaWxpdGllc1xuICAgIF0pO1xuXG4gICAgYWRkQ2FwYWJpbGl0aWVzLmNhbGwoTW9kZWwucHJvdG90eXBlLCBbXG4gICAgICAgIGV2ZW50Q2FwYWJpbGl0aWVzLFxuICAgICAgICBkZWZDYXBhYmlsaXRpZXNcbiAgICBdKTtcblxuXG4gICAgTW9kZWwuaG9vaygnY3JlYXRlJyk7XG5cbiAgICBNb2RlbC5kZWYoJ2NyZWF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShNb2RlbC5wcm90b3R5cGUpO1xuICAgICAgICBNb2RlbC5hcHBseShpbnN0YW5jZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBNb2RlbDtcblxufVxuXG5cbmZ1bmN0aW9uIGFkZENhcGFiaWxpdGllcyhkZXN0aW5hdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpIGluIGRlc3RpbmF0aW9ucykge1xuICAgICAgICBkZXN0aW5hdGlvbnNbaV0odGhpcyk7XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gbW9kZWxDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiB0YWdDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgdmFyIHRhZ3MgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3RhZycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChuYW1lLCBlbnRpdHkpIHtcblxuICAgICAgICAgICAgdmFyIHRhZyA9IGZpbmRPckNyZWF0ZVRhZy5jYWxsKHRoaXMsIHRhZ3MsIG5hbWUpO1xuICAgICAgICAgICAgcmVmZXJlbmNlVGFnTmFtZShuYW1lLCBlbnRpdHkpO1xuXG4gICAgICAgICAgICB0YWcucHVzaChlbnRpdHkpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndW50YWcnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAobmFtZSwgZW50aXR5KSB7XG5cbiAgICAgICAgICAgIGlmIChuYW1lIGluIHRhZ3MpIHtcbiAgICAgICAgICAgICAgICB0YWdzW25hbWVdLnNwbGljZSh0YWdzW25hbWVdLmluZGV4T2YoZW50aXR5KSwgMSk7XG4gICAgICAgICAgICAgICAgZW50aXR5LnRhZ2dlZEluLnNwbGljZShlbnRpdHkudGFnZ2VkSW4uaW5kZXhPZihuYW1lKSwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmaW5kT3JDcmVhdGVUYWcgKHRhZ3MsIG5hbWUpIHtcblxuICAgIGlmICghKG5hbWUgaW4gdGFncykpIHtcbiAgICAgICAgdGFnc1tuYW1lXSA9IFtdO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICAgICAgdmFsdWU6IHRhZ3NbbmFtZV1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZ3NbbmFtZV07XG5cbn1cblxuXG5mdW5jdGlvbiByZWZlcmVuY2VUYWdOYW1lIChuYW1lLCBlbnRpdHkpIHtcblxuICAgIGlmICghKCd0YWdnZWRJbicgaW4gZW50aXR5KSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW50aXR5LCAndGFnZ2VkSW4nLCB7XG4gICAgICAgICAgICB2YWx1ZTogW11cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eS50YWdnZWRJbi5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgICBlbnRpdHkudGFnZ2VkSW4ucHVzaChuYW1lKTtcbiAgICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhZ0NhcGFiaWxpdGllcztcbiIsInZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xudmFyIHB1c2ggPSBhcnJheVByb3RvLnB1c2g7XG52YXIgZm9yRWFjaCA9IGFycmF5UHJvdG8uZm9yRWFjaDtcblxuXG5mdW5jdGlvbiAkIChhcmcpIHtcblxuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmICh0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFyZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSAkKGRvY3VtZW50KS5vbignRE9NQ29udGVudExvYWRlZCcsIGFyZyk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG5ldyBRdWVyeVNlbGVjdG9yKGFyZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuXG59XG5cblxuZnVuY3Rpb24gUXVlcnlTZWxlY3RvciAoYXJnKSB7XG5cbiAgICB2YXIgdmFsdWU7XG5cbiAgICBpZiAoYXJnICYmIGFyZy5ub2RlVHlwZSkge1xuICAgICAgICB2YWx1ZSA9IFthcmddO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gJycgKyBhcmcgPT09IGFyZyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYXJnKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwdXNoLmFwcGx5KHRoaXMsIHZhbHVlKTtcblxufVxuXG5cbihmdW5jdGlvbiAocHJvdG8pIHtcblxuICAgIHByb3RvLmxlbmd0aCA9IDA7XG5cbiAgICBwcm90by5zcGxpY2UgPSBzcGxpY2U7XG5cblxuICAgIHByb3RvLm9uID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmbmMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChuYW1lLCBmbmMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZm5jKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgcHJvdG8uZWFjaCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdmFsdWUpIHtcbiAgICAgICAgZm9yRWFjaC5jYWxsKHRoaXMsIGl0ZXJhdG9yLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbn0pKFF1ZXJ5U2VsZWN0b3IucHJvdG90eXBlKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnJlcXVpcmUoJy4uL2NvcmUvbW9kZWwnKShBcmMpO1xuXG5cbmZ1bmN0aW9uIEFyYyAoeCwgeSwgcmFkaXVzLCBhbmdsZXMsIGFudGlDbG9ja3dpc2UpIHtcbiAgICB0aGlzLnR5cGUgPSAnQXJjJztcblxuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLnN0YXJ0QW5nbGUgPSBhbmdsZXNbMF07XG4gICAgdGhpcy5lbmRBbmdsZSA9IGFuZ2xlc1sxXTtcbiAgICB0aGlzLmFudGlDbG9ja3dpc2UgPSBhbnRpQ2xvY2t3aXNlIHx8IGZhbHNlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQXJjO1xuIiwicmVxdWlyZSgnLi4vY29yZS9tb2RlbCcpKENhbnZhcyk7XG5yZXF1aXJlKCcuL2NhbnZhcy9kcmF3X3BhdGgnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvZHJhd19hcmMnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvZHJhd19jaXJjbGUnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvc3R5bGl6aW5nJykoQ2FudmFzKTtcblxuXG5mdW5jdGlvbiBDYW52YXMgKGVsKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gZWwuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmVsID0gZWw7XG59XG5cblxuZnVuY3Rpb24gY2xlYXIgKCkge1xuICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5lbC53aWR0aCwgdGhpcy5lbC5oZWlnaHQpO1xufVxuXG5cbmZ1bmN0aW9uIGRyYXcgKGVudGl0eSkge1xuICAgIHRoaXNbJ2RyYXcnICsgZW50aXR5LnR5cGVdKGVudGl0eSk7XG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8uaG9vaygnZHJhdycpO1xuICAgIHByb3RvLmxvZ0hvb2soJ2RyYXcnKTtcblxuICAgIHByb3RvLmRlZignY2xlYXInLCBjbGVhcik7XG4gICAgcHJvdG8uZGVmKCdkcmF3JywgZHJhdyk7XG5cbn0pKENhbnZhcy5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzO1xuIiwiZnVuY3Rpb24gZHJhd0FyYyAoYXJjKSB7XG5cbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICB0aGlzLmNvbnRleHQuYXJjKGFyYy54LCBhcmMueSwgYXJjLnJhZGl1cywgYXJjLnN0YXJ0QW5nbGUsIGFyYy5lbmRBbmdsZSwgYXJjLmFudGljbG9ja3dpc2UpO1xuXG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDYW52YXMpIHtcblxuICAgIChmdW5jdGlvbiAocHJvdG8pIHtcblxuICAgICAgICBwcm90by5kZWYoJ2RyYXdBcmMnLCBkcmF3QXJjKTtcblxuICAgIH0pKENhbnZhcy5wcm90b3R5cGUpO1xuXG59O1xuIiwidmFyIEFyYyA9IHJlcXVpcmUoJy4uL2FyYycpO1xuXG5cbmZ1bmN0aW9uIGRyYXdDaXJjbGUgKGNpcmNsZSkge1xuXG4gICAgdmFyIGFyYyA9IG5ldyBBcmMoY2lyY2xlLngsIGNpcmNsZS55LCBjaXJjbGUucmFkaXVzLCBbMCwgMzYwXSk7XG4gICAgdGhpcy5kcmF3QXJjKGFyYyk7XG5cbiAgICByZXR1cm4gdGhpcztcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENhbnZhcykge1xuXG4gICAgKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgICAgIHByb3RvLmRlZignZHJhd0NpcmNsZScsIGRyYXdDaXJjbGUpO1xuXG4gICAgfSkoQ2FudmFzLnByb3RvdHlwZSk7XG5cbn07XG4iLCJmdW5jdGlvbiBkcmF3UGF0aCAocGF0aCkge1xuXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHBvaW50ID0gcGF0aC5zZWdtZW50c1tpXTtcblxuICAgICAgICB2YXIgb3BlcmF0aW9uID0gc2VsZWN0RHJhd2luZ09wZXJhdGlvbihwb2ludCwgaSk7XG4gICAgICAgIHZhciBkcmF3aW5nQXJncyA9IGdldERyYXdpbmdBcmdzLmNhbGwocG9pbnQsIG9wZXJhdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0W29wZXJhdGlvbl0uYXBwbHkodGhpcy5jb250ZXh0LCBkcmF3aW5nQXJncyk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbn1cblxuXG5mdW5jdGlvbiBnZXREcmF3aW5nQXJncyAob3BlcmF0aW9uKSB7XG5cbiAgICB2YXIgcG9pbnQgPSB0aGlzO1xuXG4gICAgdmFyIG9wZXJhdGlvbnMgPSB7XG4gICAgICAgIG1vdmVUbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtwb2ludC54LCBwb2ludC55XTtcbiAgICAgICAgfSxcbiAgICAgICAgYmV6aWVyQ3VydmVUbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLngsXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1swXS55LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMV0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzFdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55XG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuICAgICAgICBxdWFkcmF0aWNDdXJ2ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG9wZXJhdGlvbnMubGluZVRvID0gb3BlcmF0aW9ucy5tb3ZlVG87XG5cbiAgICByZXR1cm4gb3BlcmF0aW9uc1tvcGVyYXRpb25dKCk7XG59XG5cblxuZnVuY3Rpb24gc2VsZWN0RHJhd2luZ09wZXJhdGlvbiAocG9pbnQsIGluZGV4KSB7XG4gICAgdmFyIG9wZXJhdGlvbiA9ICdtb3ZlVG8nO1xuXG4gICAgaWYgKGluZGV4ICE9PSAwKSB7XG4gICAgICAgIHN3aXRjaCAocG9pbnQuY29udHJvbFBvaW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPSAnbGluZVRvJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPSAncXVhZHJhdGljQ3VydmVUbyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uID0gJ2JlemllckN1cnZlVG8nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvcGVyYXRpb247XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ2FudmFzKSB7XG5cbiAgICAoZnVuY3Rpb24gKHByb3RvKSB7XG5cbiAgICAgICAgcHJvdG8uZGVmKCdkcmF3UGF0aCcsIGRyYXdQYXRoKTtcblxuICAgIH0pKENhbnZhcy5wcm90b3R5cGUpO1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ2FudmFzKSB7XG5cbiAgICAoZnVuY3Rpb24gKHByb3RvKSB7XG5cblxuXG4gICAgfSkoQ2FudmFzLnByb3RvdHlwZSk7XG5cbn07XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnJlcXVpcmUoJy4uL2NvcmUvbW9kZWwnKShDaXJjbGUpO1xuXG5cbmZ1bmN0aW9uIENpcmNsZSAoeCwgeSwgcmFkaXVzKSB7XG4gICAgdGhpcy50eXBlID0gJ0NpcmNsZSc7XG5cbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnJlcXVpcmUoJy4uL2NvcmUvbW9kZWwnKShQYXRoKTtcblxuXG5mdW5jdGlvbiBQYXRoICgpIHtcbiAgICB0aGlzLnR5cGUgPSAnUGF0aCc7XG4gICAgdGhpcy5zZWdtZW50cyA9IFtdO1xufVxuXG5cbihmdW5jdGlvbiAocHJvdG8pIHtcblxuICAgIHByb3RvLmRlZignYWRkJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBwb2ludHMgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKHBvaW50c1tpXSk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59KShQYXRoLnByb3RvdHlwZSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQYXRoO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5yZXF1aXJlKCcuLi9jb3JlL21vZGVsJykoUG9pbnQpO1xuXG5cbmZ1bmN0aW9uIFBvaW50ICh4LCB5LCBjb250cm9sUG9pbnRzKSB7XG5cbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5jb250cm9sUG9pbnRzID0gW107XG5cbiAgICB0aGlzLmFkZENvbnRyb2xQb2ludHMoY29udHJvbFBvaW50cyB8fCBbXSk7XG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8uZGVmKCdhZGRDb250cm9sUG9pbnRzJywgZnVuY3Rpb24gKGNvbnRyb2xQb2ludHMpIHtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xQb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbFBvaW50c1tpXSA9IFBvaW50LmNyZWF0ZS5hcHBseShQb2ludCwgY29udHJvbFBvaW50c1tpXSk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59KShQb2ludC5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4vZG9tL2RvbScpO1xudmFyIENhbnZhcyA9IHJlcXVpcmUoJy4vZHJhdy9jYW52YXMnKTtcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9kcmF3L3BhdGgnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vZHJhdy9wb2ludCcpO1xudmFyIENpcmNsZSA9IHJlcXVpcmUoJy4vZHJhdy9jaXJjbGUnKTtcblxudmFyIHBhdGggPSBQYXRoLmNyZWF0ZSgpO1xuXG5wYXRoLmFkZChcbiAgICBQb2ludC5jcmVhdGUoNzUsIDQwKSxcbiAgICBQb2ludC5jcmVhdGUoNTAsIDI1LCBbXG4gICAgICAgIFs3NSwgMzddLFxuICAgICAgICBbNzAsIDI1XVxuICAgIF0pLFxuICAgIFBvaW50LmNyZWF0ZSgyMCwgNjIuNSwgW1xuICAgICAgICBbMjAsIDI1XSxcbiAgICAgICAgWzIwLCA2Mi41XVxuICAgIF0pLFxuICAgIFBvaW50LmNyZWF0ZSg3NSwgMTIwLCBbXG4gICAgICAgIFsyMCwgODBdLFxuICAgICAgICBbNDAsIDEwMl1cbiAgICBdKSxcbiAgICBQb2ludC5jcmVhdGUoMTMwLCA2Mi41LCBbXG4gICAgICAgIFsxMTAsIDEwMl0sXG4gICAgICAgIFsxMzAsIDgwXVxuICAgIF0pLFxuICAgIFBvaW50LmNyZWF0ZSgxMDAsIDI1LCBbXG4gICAgICAgIFsxMzAsIDYyLjVdLFxuICAgICAgICBbMTMwLCAyNV1cbiAgICBdKSxcbiAgICBQb2ludC5jcmVhdGUoNzUsIDQwLCBbXG4gICAgICAgIFs4NSwgMjVdLFxuICAgICAgICBbNzUsIDM3XVxuICAgIF0pXG4pO1xuXG52YXIgY2lyY2xlID0gQ2lyY2xlLmNyZWF0ZSgyMCwgMjAsIDEwKTtcblxuJChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbnZhcyA9IENhbnZhcy5jcmVhdGUoJCgnY2FudmFzJylbMF0pO1xuICAgIGNhbnZhcy5kcmF3KHBhdGgpO1xuICAgIC8vIGNhbnZhcy5kcmF3KGNpcmNsZSk7XG4gICAgY2FudmFzLnNpbGVudENhbGwoJ2RyYXcnLCBjaXJjbGUpO1xufSk7XG4iXX0=
