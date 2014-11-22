(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/core/def.js":[function(require,module,exports){
var hookCapabilities = require('./hook.js');
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

},{"./hook.js":"/Users/cyrillebogaert/exp/full_capabilities/core/hook.js"}],"/Users/cyrillebogaert/exp/full_capabilities/core/event.js":[function(require,module,exports){
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
require('../core/model.js')(Canvas);


function Canvas(element) {
    this.context = element.getContext('2d');
}


(function(proto) {

    proto.def('drawPath', function(path) {

        this.context.beginPath();

        for (var i = 0; i < path.segments.length; i++) {
            point = path.segments[i];

            var operation = selectDrawingOperation(point, i);
            var drawingArgs = getDrawingArgs.call(point, operation);

            this.context[operation].apply(this.context, drawingArgs);
        }

        this.context.fill();

        return this;

    });

})(Canvas.prototype);


function getDrawingArgs(operation) {
    console.log(operation, this)
    var point = this;

    var operations = {
        moveTo: function() {
            return [point.x, point.y];
        },
        bezierCurveTo: function() {
            return [
                point.controlPoints[0].x,
                point.controlPoints[0].y,
                point.controlPoints[1].x,
                point.controlPoints[1].y,
                point.x,
                point.y
            ];
        },
        quadraticCurveTo: function() {
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


function selectDrawingOperation(point, index) {
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


module.exports = Canvas;

},{"../core/model.js":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/dom.js":[function(require,module,exports){
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

require('../core/model.js')(Path);


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

},{"../core/model.js":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/point.js":[function(require,module,exports){
var slice = Array.prototype.slice;

require('../core/model.js')(Point);


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

},{"../core/model.js":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/main.js":[function(require,module,exports){
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

},{"./draw/canvas.js":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./draw/dom.js":"/Users/cyrillebogaert/exp/full_capabilities/draw/dom.js","./draw/path.js":"/Users/cyrillebogaert/exp/full_capabilities/draw/path.js","./draw/point.js":"/Users/cyrillebogaert/exp/full_capabilities/draw/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL2RlZi5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL21vZGVsLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL3RhZy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvZG9tLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L3BhdGguanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvcG9pbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBob29rQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ob29rLmpzJyk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxudmFyIGN1c3RvbWl6YWJsZUF0dHJzID0gWyd3cml0YWJsZScsICdjb25maWd1cmFibGUnLCAnZW51bWVyYWJsZSddO1xuXG5cbmZ1bmN0aW9uIGRlZkNhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdkZWYnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBhcmdzID0gZm9ybWF0QXJndW1lbnRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBhcmdzLnNldHRpbmdzO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBhcmdzLm5hbWU7XG5cblxuICAgICAgICAgICAgc2V0dGluZ3MudmFsdWUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckhvb2soJ2JlZm9yZScsIG5hbWUsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJncy5mbmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJIb29rKCdhZnRlcicsIG5hbWUsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHNldHRpbmdzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJndW1lbnRzICgpIHtcblxuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgdmFyIHNldHRpbmdzID0ge307XG5cbiAgICBpZiAodHlwZW9mIGFyZ3NbMl0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHNldHRpbmdzID0gYXJnc1sxXS5zcGxpdCgnICcpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2V0dGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjdXN0b21pemFibGVBdHRycy5pbmRleE9mKHNldHRpbmdzW2ldKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzZXR0aW5nc1tzZXR0aW5nc1tpXV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBhcmdzWzBdLFxuICAgICAgICBmbmM6IGFyZ3NbMl0gfHwgYXJnc1sxXSxcbiAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzXG4gICAgfTtcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVmQ2FwYWJpbGl0aWVzO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBldmVudENhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICBpZiAodHlwZW9mIG9iamVjdC5vbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdvbicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgZmluZE9yQ3JlYXRlTGlzdGVuZXJzLmNhbGwodGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdID0gdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0gfHwgW107XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5wdXNoKGZuYyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdyZW1vdmVMaXN0ZW5lcicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgZmluZE9yQ3JlYXRlTGlzdGVuZXJzLmNhbGwodGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0uc3BsaWNlKHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLmluZGV4T2YoZm5jKSwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdlbWl0Jywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdW2ldLmFwcGx5KHRoaXMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxuZnVuY3Rpb24gZmluZE9yQ3JlYXRlTGlzdGVuZXJzKCkge1xuICAgIGlmICghKCdsaXN0ZW5lcnMnIGluIHRoaXMpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbGlzdGVuZXJzJywge1xuICAgICAgICAgICAgdmFsdWU6IHt9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZW50Q2FwYWJpbGl0aWVzO1xuIiwiZnVuY3Rpb24gaG9va0NhcGFiaWxpdGllcyhvYmplY3QpIHtcblxuICAgIHZhciBob29rcyA9IHt9O1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnaG9vaycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKG5hbWUsIHJlc3RyaWN0KSB7XG4gICAgICAgICAgICBob29rc1tuYW1lXSA9IHJlc3RyaWN0ID8gW3Jlc3RyaWN0XSA6IFsnYWZ0ZXInLCAnYmVmb3JlJ107XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3RyaWdnZXJIb29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obW9tZW50LCBuYW1lLCBhcmdzKSB7XG5cbiAgICAgICAgICAgIGlmIChuYW1lIGluIGhvb2tzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhvb2tzW25hbWVdLmluZGV4T2YobW9tZW50KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0LmFwcGx5KHRoaXMsIFttb21lbnQgKyAnICcgKyBuYW1lXS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGhvb2tDYXBhYmlsaXRpZXM7XG4iLCJ2YXIgZXZlbnRDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2V2ZW50LmpzJyk7XG52YXIgZGVmQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9kZWYuanMnKTtcbnZhciB0YWdDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL3RhZy5qcycpO1xuXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxuZnVuY3Rpb24gbW9kZWxDYXBhYmlsaXRpZXMgKE1vZGVsKSB7XG5cbiAgICBhZGRDYXBhYmlsaXRpZXMuY2FsbChNb2RlbCwgW1xuICAgICAgICBldmVudENhcGFiaWxpdGllcyxcbiAgICAgICAgZGVmQ2FwYWJpbGl0aWVzLFxuICAgICAgICB0YWdDYXBhYmlsaXRpZXNcbiAgICBdKTtcblxuICAgIGFkZENhcGFiaWxpdGllcy5jYWxsKE1vZGVsLnByb3RvdHlwZSwgW1xuICAgICAgICBldmVudENhcGFiaWxpdGllcyxcbiAgICAgICAgZGVmQ2FwYWJpbGl0aWVzXG4gICAgXSk7XG5cblxuICAgIE1vZGVsLmhvb2soJ2NyZWF0ZScpO1xuXG4gICAgTW9kZWwuZGVmKCdjcmVhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoTW9kZWwucHJvdG90eXBlKTtcbiAgICAgICAgTW9kZWwuYXBwbHkoaW5zdGFuY2UsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gTW9kZWw7XG5cbn1cblxuXG5mdW5jdGlvbiBhZGRDYXBhYmlsaXRpZXMoZGVzdGluYXRpb25zKSB7XG4gICAgZm9yICh2YXIgaSBpbiBkZXN0aW5hdGlvbnMpIHtcbiAgICAgICAgZGVzdGluYXRpb25zW2ldKHRoaXMpO1xuICAgIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vZGVsQ2FwYWJpbGl0aWVzO1xuIiwiZnVuY3Rpb24gdGFnQ2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIHZhciB0YWdzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICd0YWcnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAobmFtZSwgZW50aXR5KSB7XG5cbiAgICAgICAgICAgIHZhciB0YWcgPSBmaW5kT3JDcmVhdGVUYWcuY2FsbCh0aGlzLCB0YWdzLCBuYW1lKTtcbiAgICAgICAgICAgIHJlZmVyZW5jZVRhZ05hbWUobmFtZSwgZW50aXR5KTtcblxuICAgICAgICAgICAgdGFnLnB1c2goZW50aXR5KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3VudGFnJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKG5hbWUsIGVudGl0eSkge1xuXG4gICAgICAgICAgICBpZiAobmFtZSBpbiB0YWdzKSB7XG4gICAgICAgICAgICAgICAgdGFnc1tuYW1lXS5zcGxpY2UodGFnc1tuYW1lXS5pbmRleE9mKGVudGl0eSksIDEpO1xuICAgICAgICAgICAgICAgIGVudGl0eS50YWdnZWRJbi5zcGxpY2UoZW50aXR5LnRhZ2dlZEluLmluZGV4T2YobmFtZSksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxuZnVuY3Rpb24gZmluZE9yQ3JlYXRlVGFnICh0YWdzLCBuYW1lKSB7XG5cbiAgICBpZiAoIShuYW1lIGluIHRhZ3MpKSB7XG4gICAgICAgIHRhZ3NbbmFtZV0gPSBbXTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0YWdzW25hbWVdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0YWdzW25hbWVdO1xuXG59XG5cblxuZnVuY3Rpb24gcmVmZXJlbmNlVGFnTmFtZSAobmFtZSwgZW50aXR5KSB7XG5cbiAgICBpZiAoISgndGFnZ2VkSW4nIGluIGVudGl0eSkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVudGl0eSwgJ3RhZ2dlZEluJywge1xuICAgICAgICAgICAgdmFsdWU6IFtdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChlbnRpdHkudGFnZ2VkSW4uaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgZW50aXR5LnRhZ2dlZEluLnB1c2gobmFtZSk7XG4gICAgfVxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB0YWdDYXBhYmlsaXRpZXM7XG4iLCJyZXF1aXJlKCcuLi9jb3JlL21vZGVsLmpzJykoQ2FudmFzKTtcblxuXG5mdW5jdGlvbiBDYW52YXMoZWxlbWVudCkge1xuICAgIHRoaXMuY29udGV4dCA9IGVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbn1cblxuXG4oZnVuY3Rpb24ocHJvdG8pIHtcblxuICAgIHByb3RvLmRlZignZHJhd1BhdGgnLCBmdW5jdGlvbihwYXRoKSB7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5zZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcG9pbnQgPSBwYXRoLnNlZ21lbnRzW2ldO1xuXG4gICAgICAgICAgICB2YXIgb3BlcmF0aW9uID0gc2VsZWN0RHJhd2luZ09wZXJhdGlvbihwb2ludCwgaSk7XG4gICAgICAgICAgICB2YXIgZHJhd2luZ0FyZ3MgPSBnZXREcmF3aW5nQXJncy5jYWxsKHBvaW50LCBvcGVyYXRpb24pO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRbb3BlcmF0aW9uXS5hcHBseSh0aGlzLmNvbnRleHQsIGRyYXdpbmdBcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9KTtcblxufSkoQ2FudmFzLnByb3RvdHlwZSk7XG5cblxuZnVuY3Rpb24gZ2V0RHJhd2luZ0FyZ3Mob3BlcmF0aW9uKSB7XG4gICAgY29uc29sZS5sb2cob3BlcmF0aW9uLCB0aGlzKVxuICAgIHZhciBwb2ludCA9IHRoaXM7XG5cbiAgICB2YXIgb3BlcmF0aW9ucyA9IHtcbiAgICAgICAgbW92ZVRvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBbcG9pbnQueCwgcG9pbnQueV07XG4gICAgICAgIH0sXG4gICAgICAgIGJlemllckN1cnZlVG86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzBdLngsXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1swXS55LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMV0ueCxcbiAgICAgICAgICAgICAgICBwb2ludC5jb250cm9sUG9pbnRzWzFdLnksXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55XG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuICAgICAgICBxdWFkcmF0aWNDdXJ2ZVRvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgcG9pbnQuY29udHJvbFBvaW50c1swXS54LFxuICAgICAgICAgICAgICAgIHBvaW50LmNvbnRyb2xQb2ludHNbMF0ueSxcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgb3BlcmF0aW9ucy5saW5lVG8gPSBvcGVyYXRpb25zLm1vdmVUbztcblxuICAgIHJldHVybiBvcGVyYXRpb25zW29wZXJhdGlvbl0oKTtcbn1cblxuXG5mdW5jdGlvbiBzZWxlY3REcmF3aW5nT3BlcmF0aW9uKHBvaW50LCBpbmRleCkge1xuICAgIHZhciBvcGVyYXRpb24gPSAnbW92ZVRvJztcblxuICAgIGlmIChpbmRleCAhPT0gMCkge1xuICAgICAgICBzd2l0Y2ggKHBvaW50LmNvbnRyb2xQb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uID0gJ2xpbmVUbyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uID0gJ3F1YWRyYXRpY0N1cnZlVG8nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9ICdiZXppZXJDdXJ2ZVRvJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9uO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzO1xuIiwidmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG52YXIgcHVzaCA9IGFycmF5UHJvdG8ucHVzaDtcbnZhciBmb3JFYWNoID0gYXJyYXlQcm90by5mb3JFYWNoO1xuXG5cbmZ1bmN0aW9uICQgKGFyZykge1xuXG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKC9eZi8udGVzdCh0eXBlb2YgYXJnKSkge1xuICAgICAgICBpZiAoL2MvLnRlc3QoZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYXJnKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICQoZG9jdW1lbnQpLm9uKCdET01Db250ZW50TG9hZGVkJywgYXJnKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gbmV3IFF1ZXJ5U2VsZWN0b3IoYXJnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG5cbn1cblxuXG5mdW5jdGlvbiBRdWVyeVNlbGVjdG9yIChhcmcpIHtcblxuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmIChhcmcgJiYgYXJnLm5vZGVUeXBlKSB7XG4gICAgICAgIHZhbHVlID0gW2FyZ107XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAnJyArIGFyZyA9PT0gYXJnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhcmcpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1c2guYXBwbHkodGhpcywgdmFsdWUpO1xuXG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8ubGVuZ3RoID0gMDtcblxuICAgIHByb3RvLnNwbGljZSA9IHNwbGljZTtcblxuXG4gICAgcHJvdG8ub24gPSBmdW5jdGlvbiAobmFtZSwgZm5jKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZuYyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBmbmMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICBwcm90by5lYWNoID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB2YWx1ZSkge1xuICAgICAgICBmb3JFYWNoLmNhbGwodGhpcywgaXRlcmF0b3IsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxufSkoUXVlcnlTZWxlY3Rvci5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gJDtcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxucmVxdWlyZSgnLi4vY29yZS9tb2RlbC5qcycpKFBhdGgpO1xuXG5cbmZ1bmN0aW9uIFBhdGggKCkge1xuICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcbn1cblxuXG4oZnVuY3Rpb24gKHByb3RvKSB7XG5cbiAgICBwcm90by5kZWYoJ2FkZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgcG9pbnRzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChwb2ludHNbaV0pO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxufSkoUGF0aC5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGF0aDtcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxucmVxdWlyZSgnLi4vY29yZS9tb2RlbC5qcycpKFBvaW50KTtcblxuXG5mdW5jdGlvbiBQb2ludCAoeCwgeSwgY29udHJvbFBvaW50cykge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmNvbnRyb2xQb2ludHMgPSBbXTtcblxuICAgIHRoaXMuYWRkQ29udHJvbFBvaW50cyhjb250cm9sUG9pbnRzIHx8IFtdKTtcbn1cblxuXG4oZnVuY3Rpb24gKHByb3RvKSB7XG5cbiAgICBwcm90by5kZWYoJ2FkZENvbnRyb2xQb2ludHMnLCBmdW5jdGlvbiAoY29udHJvbFBvaW50cykge1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udHJvbFBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sUG9pbnRzW2ldID0gUG9pbnQuY3JlYXRlLmFwcGx5KFBvaW50LCBjb250cm9sUG9pbnRzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbn0pKFBvaW50LnByb3RvdHlwZSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcbiIsInZhciAkID0gcmVxdWlyZSgnLi9kcmF3L2RvbS5qcycpO1xudmFyIENhbnZhcyA9IHJlcXVpcmUoJy4vZHJhdy9jYW52YXMuanMnKTtcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9kcmF3L3BhdGguanMnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vZHJhdy9wb2ludC5qcycpO1xuXG52YXIgcGF0aCA9IFBhdGguY3JlYXRlKCk7XG5cbnBhdGguYWRkKFxuICAgIFBvaW50LmNyZWF0ZSg3NSwgNDApLFxuICAgIFBvaW50LmNyZWF0ZSg1MCwgMjUsIFtcbiAgICAgICAgWzc1LCAzN10sXG4gICAgICAgIFs3MCwgMjVdXG4gICAgXSksXG4gICAgUG9pbnQuY3JlYXRlKDIwLCA2Mi41LCBbXG4gICAgICAgIFsyMCwgMjVdLFxuICAgICAgICBbMjAsIDYyLjVdXG4gICAgXSksXG4gICAgUG9pbnQuY3JlYXRlKDc1LCAxMjAsIFtcbiAgICAgICAgWzIwLCA4MF0sXG4gICAgICAgIFs0MCwgMTAyXVxuICAgIF0pLFxuICAgIFBvaW50LmNyZWF0ZSgxMzAsIDYyLjUsIFtcbiAgICAgICAgWzExMCwgMTAyXSxcbiAgICAgICAgWzEzMCwgODBdXG4gICAgXSksXG4gICAgUG9pbnQuY3JlYXRlKDEwMCwgMjUsIFtcbiAgICAgICAgWzEzMCwgNjIuNV0sXG4gICAgICAgIFsxMzAsIDI1XVxuICAgIF0pLFxuICAgIFBvaW50LmNyZWF0ZSg3NSwgNDAsIFtcbiAgICAgICAgWzg1LCAyNV0sXG4gICAgICAgIFs3NSwgMzddXG4gICAgXSlcbik7XG5cblxuJChmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FudmFzID0gQ2FudmFzLmNyZWF0ZSgkKCdjYW52YXMnKVswXSk7XG4gICAgY2FudmFzLmRyYXdQYXRoKHBhdGgpO1xufSk7XG4iXX0=
