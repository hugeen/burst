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
var eventCapabilities = require('./event.js');
var defCapabilities = require('./def.js');
var tagCapabilities = require('./tag.js');

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

},{"./def.js":"/Users/cyrillebogaert/exp/full_capabilities/core/def.js","./event.js":"/Users/cyrillebogaert/exp/full_capabilities/core/event.js","./tag.js":"/Users/cyrillebogaert/exp/full_capabilities/core/tag.js"}],"/Users/cyrillebogaert/exp/full_capabilities/core/tag.js":[function(require,module,exports){
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

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js":[function(require,module,exports){
require('../core/model')(Canvas);
require('./canvas/draw_path')(Canvas);


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

},{"../core/model":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js","./canvas/draw_path":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas/draw_path.js":[function(require,module,exports){
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

},{}],"/Users/cyrillebogaert/exp/full_capabilities/draw/dom.js":[function(require,module,exports){
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
var push = arrayProto.push;
var forEach = arrayProto.forEach;


function $ (arg) {

    var value;

    if (/^f/.test(typeof arg)) {
        if (/c/.test(document.readyState)) {
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


$(function () {
    var canvas = Canvas.create($('canvas')[0]);
    canvas.drawPath(path);
});

},{"./draw/canvas":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./draw/dom":"/Users/cyrillebogaert/exp/full_capabilities/draw/dom.js","./draw/path":"/Users/cyrillebogaert/exp/full_capabilities/draw/path.js","./draw/point":"/Users/cyrillebogaert/exp/full_capabilities/draw/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL2RlZi5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL21vZGVsLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL3RhZy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvY2FudmFzL2RyYXdfcGF0aC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9kb20uanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvcGF0aC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9wb2ludC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGhvb2tDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2hvb2snKTtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG52YXIgY3VzdG9taXphYmxlQXR0cnMgPSBbJ3dyaXRhYmxlJywgJ2NvbmZpZ3VyYWJsZScsICdlbnVtZXJhYmxlJ107XG5cblxuZnVuY3Rpb24gZGVmQ2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2RlZicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBmb3JtYXRBcmd1bWVudHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IGFyZ3Muc2V0dGluZ3M7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGFyZ3MubmFtZTtcblxuXG4gICAgICAgICAgICBzZXR0aW5ncy52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VySG9vaygnYmVmb3JlJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzLmZuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckhvb2soJ2FmdGVyJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgc2V0dGluZ3MpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcmd1bWVudHMgKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgc2V0dGluZ3MgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgYXJnc1syXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2V0dGluZ3MgPSBhcmdzWzFdLnNwbGl0KCcgJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXR0aW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGN1c3RvbWl6YWJsZUF0dHJzLmluZGV4T2Yoc2V0dGluZ3NbaV0pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzW3NldHRpbmdzW2ldXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGFyZ3NbMF0sXG4gICAgICAgIGZuYzogYXJnc1syXSB8fCBhcmdzWzFdLFxuICAgICAgICBzZXR0aW5nczogc2V0dGluZ3NcbiAgICB9O1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZDYXBhYmlsaXRpZXM7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGV2ZW50Q2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGlmICh0eXBlb2Ygb2JqZWN0Lm9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ29uJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0gPSB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXSB8fCBbXTtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLnB1c2goZm5jKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3JlbW92ZUxpc3RlbmVyJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5zcGxpY2UodGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0uaW5kZXhPZihmbmMpLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2VtaXQnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGZpbmRPckNyZWF0ZUxpc3RlbmVycy5jYWxsKHRoaXMpO1xuXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl1baV0uYXBwbHkodGhpcywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKCEoJ2xpc3RlbmVycycgaW4gdGhpcykpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdsaXN0ZW5lcnMnLCB7XG4gICAgICAgICAgICB2YWx1ZToge31cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCkge1xuXG4gICAgdmFyIGhvb2tzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdob29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgcmVzdHJpY3QpIHtcbiAgICAgICAgICAgIGhvb2tzW25hbWVdID0gcmVzdHJpY3QgPyBbcmVzdHJpY3RdIDogWydhZnRlcicsICdiZWZvcmUnXTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndHJpZ2dlckhvb2snLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihtb21lbnQsIG5hbWUsIGFyZ3MpIHtcblxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gaG9va3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoaG9va3NbbmFtZV0uaW5kZXhPZihtb21lbnQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQuYXBwbHkodGhpcywgW21vbWVudCArICcgJyArIG5hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaG9va0NhcGFiaWxpdGllcztcbiIsInZhciBldmVudENhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vZXZlbnQuanMnKTtcbnZhciBkZWZDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2RlZi5qcycpO1xudmFyIHRhZ0NhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vdGFnLmpzJyk7XG5cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBtb2RlbENhcGFiaWxpdGllcyAoTW9kZWwpIHtcblxuICAgIGFkZENhcGFiaWxpdGllcy5jYWxsKE1vZGVsLCBbXG4gICAgICAgIGV2ZW50Q2FwYWJpbGl0aWVzLFxuICAgICAgICBkZWZDYXBhYmlsaXRpZXMsXG4gICAgICAgIHRhZ0NhcGFiaWxpdGllc1xuICAgIF0pO1xuXG4gICAgYWRkQ2FwYWJpbGl0aWVzLmNhbGwoTW9kZWwucHJvdG90eXBlLCBbXG4gICAgICAgIGV2ZW50Q2FwYWJpbGl0aWVzLFxuICAgICAgICBkZWZDYXBhYmlsaXRpZXNcbiAgICBdKTtcblxuXG4gICAgTW9kZWwuaG9vaygnY3JlYXRlJyk7XG5cbiAgICBNb2RlbC5kZWYoJ2NyZWF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShNb2RlbC5wcm90b3R5cGUpO1xuICAgICAgICBNb2RlbC5hcHBseShpbnN0YW5jZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBNb2RlbDtcblxufVxuXG5cbmZ1bmN0aW9uIGFkZENhcGFiaWxpdGllcyhkZXN0aW5hdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpIGluIGRlc3RpbmF0aW9ucykge1xuICAgICAgICBkZXN0aW5hdGlvbnNbaV0odGhpcyk7XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gbW9kZWxDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiB0YWdDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgdmFyIHRhZ3MgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3RhZycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChuYW1lLCBlbnRpdHkpIHtcblxuICAgICAgICAgICAgdmFyIHRhZyA9IGZpbmRPckNyZWF0ZVRhZy5jYWxsKHRoaXMsIHRhZ3MsIG5hbWUpO1xuICAgICAgICAgICAgcmVmZXJlbmNlVGFnTmFtZShuYW1lLCBlbnRpdHkpO1xuXG4gICAgICAgICAgICB0YWcucHVzaChlbnRpdHkpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndW50YWcnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAobmFtZSwgZW50aXR5KSB7XG5cbiAgICAgICAgICAgIGlmIChuYW1lIGluIHRhZ3MpIHtcbiAgICAgICAgICAgICAgICB0YWdzW25hbWVdLnNwbGljZSh0YWdzW25hbWVdLmluZGV4T2YoZW50aXR5KSwgMSk7XG4gICAgICAgICAgICAgICAgZW50aXR5LnRhZ2dlZEluLnNwbGljZShlbnRpdHkudGFnZ2VkSW4uaW5kZXhPZihuYW1lKSwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmaW5kT3JDcmVhdGVUYWcgKHRhZ3MsIG5hbWUpIHtcblxuICAgIGlmICghKG5hbWUgaW4gdGFncykpIHtcbiAgICAgICAgdGFnc1tuYW1lXSA9IFtdO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICAgICAgdmFsdWU6IHRhZ3NbbmFtZV1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZ3NbbmFtZV07XG5cbn1cblxuXG5mdW5jdGlvbiByZWZlcmVuY2VUYWdOYW1lIChuYW1lLCBlbnRpdHkpIHtcblxuICAgIGlmICghKCd0YWdnZWRJbicgaW4gZW50aXR5KSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW50aXR5LCAndGFnZ2VkSW4nLCB7XG4gICAgICAgICAgICB2YWx1ZTogW11cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eS50YWdnZWRJbi5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgICBlbnRpdHkudGFnZ2VkSW4ucHVzaChuYW1lKTtcbiAgICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhZ0NhcGFiaWxpdGllcztcbiIsInJlcXVpcmUoJy4uL2NvcmUvbW9kZWwnKShDYW52YXMpO1xucmVxdWlyZSgnLi9jYW52YXMvZHJhd19wYXRoJykoQ2FudmFzKTtcblxuXG5mdW5jdGlvbiBDYW52YXMgKGVsKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gZWwuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmVsID0gZWw7XG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8uZGVmKCdjbGVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmVsLndpZHRoLCB0aGlzLmVsLmhlaWdodCk7XG4gICAgfSk7XG5cbn0pKENhbnZhcy5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzO1xuIiwiZnVuY3Rpb24gZHJhd1BhdGhDYXBhYmlsaXRpZXMgKENhbnZhcykge1xuXG4gICAgKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgICAgIHByb3RvLmRlZignZHJhd1BhdGgnLCBmdW5jdGlvbiAocGF0aCkge1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5zZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBvaW50ID0gcGF0aC5zZWdtZW50c1tpXTtcblxuICAgICAgICAgICAgICAgIHZhciBvcGVyYXRpb24gPSBzZWxlY3REcmF3aW5nT3BlcmF0aW9uKHBvaW50LCBpKTtcbiAgICAgICAgICAgICAgICB2YXIgZHJhd2luZ0FyZ3MgPSBnZXREcmF3aW5nQXJncy5jYWxsKHBvaW50LCBvcGVyYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0W29wZXJhdGlvbl0uYXBwbHkodGhpcy5jb250ZXh0LCBkcmF3aW5nQXJncyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KShDYW52YXMucHJvdG90eXBlKTtcblxufVxuXG5cbmZ1bmN0aW9uIGdldERyYXdpbmdBcmdzIChvcGVyYXRpb24pIHtcblxuICAgIHZhciBwb2ludCA9IHRoaXM7XG5cbiAgICB2YXIgb3BlcmF0aW9ucyA9IHtcbiAgICAgICAgbW92ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW3BvaW50LngsIHBvaW50LnldO1xuICAgICAgICB9LFxuICAgICAgICBiZXppZXJDdXJ2ZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1sxXS54LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMV0ueSxcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0sXG4gICAgICAgIHF1YWRyYXRpY0N1cnZlVG86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1swXS54LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueSxcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgb3BlcmF0aW9ucy5saW5lVG8gPSBvcGVyYXRpb25zLm1vdmVUbztcblxuICAgIHJldHVybiBvcGVyYXRpb25zW29wZXJhdGlvbl0oKTtcbn1cblxuXG5mdW5jdGlvbiBzZWxlY3REcmF3aW5nT3BlcmF0aW9uIChwb2ludCwgaW5kZXgpIHtcbiAgICB2YXIgb3BlcmF0aW9uID0gJ21vdmVUbyc7XG5cbiAgICBpZiAoaW5kZXggIT09IDApIHtcbiAgICAgICAgc3dpdGNoIChwb2ludC5jb250cm9sUG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9ICdsaW5lVG8nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9ICdxdWFkcmF0aWNDdXJ2ZVRvJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPSAnYmV6aWVyQ3VydmVUbyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9wZXJhdGlvbjtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRyYXdQYXRoQ2FwYWJpbGl0aWVzO1xuIiwidmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG52YXIgcHVzaCA9IGFycmF5UHJvdG8ucHVzaDtcbnZhciBmb3JFYWNoID0gYXJyYXlQcm90by5mb3JFYWNoO1xuXG5cbmZ1bmN0aW9uICQgKGFyZykge1xuXG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKC9eZi8udGVzdCh0eXBlb2YgYXJnKSkge1xuICAgICAgICBpZiAoL2MvLnRlc3QoZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYXJnKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICQoZG9jdW1lbnQpLm9uKCdET01Db250ZW50TG9hZGVkJywgYXJnKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gbmV3IFF1ZXJ5U2VsZWN0b3IoYXJnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG5cbn1cblxuXG5mdW5jdGlvbiBRdWVyeVNlbGVjdG9yIChhcmcpIHtcblxuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmIChhcmcgJiYgYXJnLm5vZGVUeXBlKSB7XG4gICAgICAgIHZhbHVlID0gW2FyZ107XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAnJyArIGFyZyA9PT0gYXJnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhcmcpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1c2guYXBwbHkodGhpcywgdmFsdWUpO1xuXG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8ubGVuZ3RoID0gMDtcblxuICAgIHByb3RvLnNwbGljZSA9IHNwbGljZTtcblxuXG4gICAgcHJvdG8ub24gPSBmdW5jdGlvbiAobmFtZSwgZm5jKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZuYyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBmbmMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICBwcm90by5lYWNoID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB2YWx1ZSkge1xuICAgICAgICBmb3JFYWNoLmNhbGwodGhpcywgaXRlcmF0b3IsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxufSkoUXVlcnlTZWxlY3Rvci5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gJDtcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxucmVxdWlyZSgnLi4vY29yZS9tb2RlbCcpKFBhdGgpO1xuXG5cbmZ1bmN0aW9uIFBhdGggKCkge1xuICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcbn1cblxuXG4oZnVuY3Rpb24gKHByb3RvKSB7XG5cbiAgICBwcm90by5kZWYoJ2FkZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgcG9pbnRzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChwb2ludHNbaV0pO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxufSkoUGF0aC5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGF0aDtcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxucmVxdWlyZSgnLi4vY29yZS9tb2RlbCcpKFBvaW50KTtcblxuXG5mdW5jdGlvbiBQb2ludCAoeCwgeSwgY29udHJvbFBvaW50cykge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmNvbnRyb2xQb2ludHMgPSBbXTtcblxuICAgIHRoaXMuYWRkQ29udHJvbFBvaW50cyhjb250cm9sUG9pbnRzIHx8IFtdKTtcbn1cblxuXG4oZnVuY3Rpb24gKHByb3RvKSB7XG5cbiAgICBwcm90by5kZWYoJ2FkZENvbnRyb2xQb2ludHMnLCBmdW5jdGlvbiAoY29udHJvbFBvaW50cykge1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udHJvbFBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sUG9pbnRzW2ldID0gUG9pbnQuY3JlYXRlLmFwcGx5KFBvaW50LCBjb250cm9sUG9pbnRzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbn0pKFBvaW50LnByb3RvdHlwZSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcbiIsInZhciAkID0gcmVxdWlyZSgnLi9kcmF3L2RvbScpO1xudmFyIENhbnZhcyA9IHJlcXVpcmUoJy4vZHJhdy9jYW52YXMnKTtcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9kcmF3L3BhdGgnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vZHJhdy9wb2ludCcpO1xuXG52YXIgcGF0aCA9IFBhdGguY3JlYXRlKCk7XG5cbnBhdGguYWRkKFxuICAgIFBvaW50LmNyZWF0ZSg3NSwgNDApLFxuICAgIFBvaW50LmNyZWF0ZSg1MCwgMjUsIFtcbiAgICAgICAgWzc1LCAzN10sXG4gICAgICAgIFs3MCwgMjVdXG4gICAgXSksXG4gICAgUG9pbnQuY3JlYXRlKDIwLCA2Mi41LCBbXG4gICAgICAgIFsyMCwgMjVdLFxuICAgICAgICBbMjAsIDYyLjVdXG4gICAgXSksXG4gICAgUG9pbnQuY3JlYXRlKDc1LCAxMjAsIFtcbiAgICAgICAgWzIwLCA4MF0sXG4gICAgICAgIFs0MCwgMTAyXVxuICAgIF0pLFxuICAgIFBvaW50LmNyZWF0ZSgxMzAsIDYyLjUsIFtcbiAgICAgICAgWzExMCwgMTAyXSxcbiAgICAgICAgWzEzMCwgODBdXG4gICAgXSksXG4gICAgUG9pbnQuY3JlYXRlKDEwMCwgMjUsIFtcbiAgICAgICAgWzEzMCwgNjIuNV0sXG4gICAgICAgIFsxMzAsIDI1XVxuICAgIF0pLFxuICAgIFBvaW50LmNyZWF0ZSg3NSwgNDAsIFtcbiAgICAgICAgWzg1LCAyNV0sXG4gICAgICAgIFs3NSwgMzddXG4gICAgXSlcbik7XG5cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbnZhcyA9IENhbnZhcy5jcmVhdGUoJCgnY2FudmFzJylbMF0pO1xuICAgIGNhbnZhcy5kcmF3UGF0aChwYXRoKTtcbn0pO1xuIl19
