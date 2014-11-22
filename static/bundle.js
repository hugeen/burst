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


function Canvas (element) {
    this.context = element.getContext('2d');
}


(function (proto) {

    proto.def('drawPath', function (path) {

        this.context.beginPath();

        for (var i = 0; i < path.segments.length; i++) {
            point = path.segments[i];
            this.context[i !== 0 ? 'lineTo' : 'moveTo'](point.x, point.y);
        }

        this.context.fill();

        return this;

    });

})(Canvas.prototype);


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
require('../core/model.js')(Path);


function Path () {
    this.segments = [];
}


(function (proto) {

    proto.def('add', function (point) {
        this.segments.push(point);
    });

})(Path.prototype);


module.exports = Path;

},{"../core/model.js":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/draw/point.js":[function(require,module,exports){
require('../core/model.js')(Point);

function Point (x, y, controlPoints) {
    this.x = x;
    this.y = y;
    this.controlPoints = controlPoints || null;
}


(function (proto) {

    PointProto.def('addControlPoint', function () {

    });

})(Point.prototype);


module.exports = Point;

},{"../core/model.js":"/Users/cyrillebogaert/exp/full_capabilities/core/model.js"}],"/Users/cyrillebogaert/exp/full_capabilities/main.js":[function(require,module,exports){
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

},{"./draw/canvas.js":"/Users/cyrillebogaert/exp/full_capabilities/draw/canvas.js","./draw/dom.js":"/Users/cyrillebogaert/exp/full_capabilities/draw/dom.js","./draw/path.js":"/Users/cyrillebogaert/exp/full_capabilities/draw/path.js","./draw/point.js":"/Users/cyrillebogaert/exp/full_capabilities/draw/point.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL2RlZi5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY29yZS9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL21vZGVsLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jb3JlL3RhZy5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvZHJhdy9jYW52YXMuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvZG9tLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9kcmF3L3BhdGguanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2RyYXcvcG9pbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGhvb2tDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2hvb2suanMnKTtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG52YXIgY3VzdG9taXphYmxlQXR0cnMgPSBbJ3dyaXRhYmxlJywgJ2NvbmZpZ3VyYWJsZScsICdlbnVtZXJhYmxlJ107XG5cblxuZnVuY3Rpb24gZGVmQ2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2RlZicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBmb3JtYXRBcmd1bWVudHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IGFyZ3Muc2V0dGluZ3M7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGFyZ3MubmFtZTtcblxuXG4gICAgICAgICAgICBzZXR0aW5ncy52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VySG9vaygnYmVmb3JlJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzLmZuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckhvb2soJ2FmdGVyJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgc2V0dGluZ3MpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcmd1bWVudHMgKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgc2V0dGluZ3MgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgYXJnc1syXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2V0dGluZ3MgPSBhcmdzWzFdLnNwbGl0KCcgJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXR0aW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGN1c3RvbWl6YWJsZUF0dHJzLmluZGV4T2Yoc2V0dGluZ3NbaV0pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzW3NldHRpbmdzW2ldXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGFyZ3NbMF0sXG4gICAgICAgIGZuYzogYXJnc1syXSB8fCBhcmdzWzFdLFxuICAgICAgICBzZXR0aW5nczogc2V0dGluZ3NcbiAgICB9O1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZDYXBhYmlsaXRpZXM7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGV2ZW50Q2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGlmICh0eXBlb2Ygb2JqZWN0Lm9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ29uJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0gPSB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXSB8fCBbXTtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLnB1c2goZm5jKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3JlbW92ZUxpc3RlbmVyJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5zcGxpY2UodGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0uaW5kZXhPZihmbmMpLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2VtaXQnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGZpbmRPckNyZWF0ZUxpc3RlbmVycy5jYWxsKHRoaXMpO1xuXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl1baV0uYXBwbHkodGhpcywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKCEoJ2xpc3RlbmVycycgaW4gdGhpcykpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdsaXN0ZW5lcnMnLCB7XG4gICAgICAgICAgICB2YWx1ZToge31cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCkge1xuXG4gICAgdmFyIGhvb2tzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdob29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgcmVzdHJpY3QpIHtcbiAgICAgICAgICAgIGhvb2tzW25hbWVdID0gcmVzdHJpY3QgPyBbcmVzdHJpY3RdIDogWydhZnRlcicsICdiZWZvcmUnXTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndHJpZ2dlckhvb2snLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihtb21lbnQsIG5hbWUsIGFyZ3MpIHtcblxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gaG9va3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoaG9va3NbbmFtZV0uaW5kZXhPZihtb21lbnQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQuYXBwbHkodGhpcywgW21vbWVudCArICcgJyArIG5hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaG9va0NhcGFiaWxpdGllcztcbiIsInZhciBldmVudENhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vZXZlbnQuanMnKTtcbnZhciBkZWZDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2RlZi5qcycpO1xudmFyIHRhZ0NhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vdGFnLmpzJyk7XG5cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBtb2RlbENhcGFiaWxpdGllcyAoTW9kZWwpIHtcblxuICAgIGFkZENhcGFiaWxpdGllcy5jYWxsKE1vZGVsLCBbXG4gICAgICAgIGV2ZW50Q2FwYWJpbGl0aWVzLFxuICAgICAgICBkZWZDYXBhYmlsaXRpZXMsXG4gICAgICAgIHRhZ0NhcGFiaWxpdGllc1xuICAgIF0pO1xuXG4gICAgYWRkQ2FwYWJpbGl0aWVzLmNhbGwoTW9kZWwucHJvdG90eXBlLCBbXG4gICAgICAgIGV2ZW50Q2FwYWJpbGl0aWVzLFxuICAgICAgICBkZWZDYXBhYmlsaXRpZXNcbiAgICBdKTtcblxuXG4gICAgTW9kZWwuaG9vaygnY3JlYXRlJyk7XG5cbiAgICBNb2RlbC5kZWYoJ2NyZWF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShNb2RlbC5wcm90b3R5cGUpO1xuICAgICAgICBNb2RlbC5hcHBseShpbnN0YW5jZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBNb2RlbDtcblxufVxuXG5cbmZ1bmN0aW9uIGFkZENhcGFiaWxpdGllcyhkZXN0aW5hdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpIGluIGRlc3RpbmF0aW9ucykge1xuICAgICAgICBkZXN0aW5hdGlvbnNbaV0odGhpcyk7XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gbW9kZWxDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiB0YWdDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgdmFyIHRhZ3MgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3RhZycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChuYW1lLCBlbnRpdHkpIHtcblxuICAgICAgICAgICAgdmFyIHRhZyA9IGZpbmRPckNyZWF0ZVRhZy5jYWxsKHRoaXMsIHRhZ3MsIG5hbWUpO1xuICAgICAgICAgICAgcmVmZXJlbmNlVGFnTmFtZShuYW1lLCBlbnRpdHkpO1xuXG4gICAgICAgICAgICB0YWcucHVzaChlbnRpdHkpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndW50YWcnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAobmFtZSwgZW50aXR5KSB7XG5cbiAgICAgICAgICAgIGlmIChuYW1lIGluIHRhZ3MpIHtcbiAgICAgICAgICAgICAgICB0YWdzW25hbWVdLnNwbGljZSh0YWdzW25hbWVdLmluZGV4T2YoZW50aXR5KSwgMSk7XG4gICAgICAgICAgICAgICAgZW50aXR5LnRhZ2dlZEluLnNwbGljZShlbnRpdHkudGFnZ2VkSW4uaW5kZXhPZihuYW1lKSwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmaW5kT3JDcmVhdGVUYWcgKHRhZ3MsIG5hbWUpIHtcblxuICAgIGlmICghKG5hbWUgaW4gdGFncykpIHtcbiAgICAgICAgdGFnc1tuYW1lXSA9IFtdO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICAgICAgdmFsdWU6IHRhZ3NbbmFtZV1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZ3NbbmFtZV07XG5cbn1cblxuXG5mdW5jdGlvbiByZWZlcmVuY2VUYWdOYW1lIChuYW1lLCBlbnRpdHkpIHtcblxuICAgIGlmICghKCd0YWdnZWRJbicgaW4gZW50aXR5KSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW50aXR5LCAndGFnZ2VkSW4nLCB7XG4gICAgICAgICAgICB2YWx1ZTogW11cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eS50YWdnZWRJbi5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgICBlbnRpdHkudGFnZ2VkSW4ucHVzaChuYW1lKTtcbiAgICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhZ0NhcGFiaWxpdGllcztcbiIsInJlcXVpcmUoJy4uL2NvcmUvbW9kZWwuanMnKShDYW52YXMpO1xuXG5cbmZ1bmN0aW9uIENhbnZhcyAoZWxlbWVudCkge1xuICAgIHRoaXMuY29udGV4dCA9IGVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbn1cblxuXG4oZnVuY3Rpb24gKHByb3RvKSB7XG5cbiAgICBwcm90by5kZWYoJ2RyYXdQYXRoJywgZnVuY3Rpb24gKHBhdGgpIHtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwb2ludCA9IHBhdGguc2VnbWVudHNbaV07XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRbaSAhPT0gMCA/ICdsaW5lVG8nIDogJ21vdmVUbyddKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0pO1xuXG59KShDYW52YXMucHJvdG90eXBlKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcbiIsInZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xudmFyIHB1c2ggPSBhcnJheVByb3RvLnB1c2g7XG52YXIgZm9yRWFjaCA9IGFycmF5UHJvdG8uZm9yRWFjaDtcblxuXG5mdW5jdGlvbiAkIChhcmcpIHtcblxuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmICgvXmYvLnRlc3QodHlwZW9mIGFyZykpIHtcbiAgICAgICAgaWYgKC9jLy50ZXN0KGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFyZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSAkKGRvY3VtZW50KS5vbignRE9NQ29udGVudExvYWRlZCcsIGFyZyk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG5ldyBRdWVyeVNlbGVjdG9yKGFyZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuXG59XG5cblxuZnVuY3Rpb24gUXVlcnlTZWxlY3RvciAoYXJnKSB7XG5cbiAgICB2YXIgdmFsdWU7XG5cbiAgICBpZiAoYXJnICYmIGFyZy5ub2RlVHlwZSkge1xuICAgICAgICB2YWx1ZSA9IFthcmddO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gJycgKyBhcmcgPT09IGFyZyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYXJnKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwdXNoLmFwcGx5KHRoaXMsIHZhbHVlKTtcblxufVxuXG5cbihmdW5jdGlvbiAocHJvdG8pIHtcblxuICAgIHByb3RvLmxlbmd0aCA9IDA7XG5cbiAgICBwcm90by5zcGxpY2UgPSBzcGxpY2U7XG5cblxuICAgIHByb3RvLm9uID0gZnVuY3Rpb24gKG5hbWUsIGZuYykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmbmMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChuYW1lLCBmbmMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZm5jKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgcHJvdG8uZWFjaCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdmFsdWUpIHtcbiAgICAgICAgZm9yRWFjaC5jYWxsKHRoaXMsIGl0ZXJhdG9yLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbn0pKFF1ZXJ5U2VsZWN0b3IucHJvdG90eXBlKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4iLCJyZXF1aXJlKCcuLi9jb3JlL21vZGVsLmpzJykoUGF0aCk7XG5cblxuZnVuY3Rpb24gUGF0aCAoKSB7XG4gICAgdGhpcy5zZWdtZW50cyA9IFtdO1xufVxuXG5cbihmdW5jdGlvbiAocHJvdG8pIHtcblxuICAgIHByb3RvLmRlZignYWRkJywgZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChwb2ludCk7XG4gICAgfSk7XG5cbn0pKFBhdGgucHJvdG90eXBlKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGg7XG4iLCJyZXF1aXJlKCcuLi9jb3JlL21vZGVsLmpzJykoUG9pbnQpO1xuXG5mdW5jdGlvbiBQb2ludCAoeCwgeSwgY29udHJvbFBvaW50cykge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmNvbnRyb2xQb2ludHMgPSBjb250cm9sUG9pbnRzIHx8IG51bGw7XG59XG5cblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgUG9pbnRQcm90by5kZWYoJ2FkZENvbnRyb2xQb2ludCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIH0pO1xuXG59KShQb2ludC5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4vZHJhdy9kb20uanMnKTtcbnZhciBDYW52YXMgPSByZXF1aXJlKCcuL2RyYXcvY2FudmFzLmpzJyk7XG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vZHJhdy9wYXRoLmpzJyk7XG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL2RyYXcvcG9pbnQuanMnKTtcblxudmFyIHBhdGggPSBQYXRoLmNyZWF0ZSgpO1xuXG5wYXRoLmFkZChQb2ludC5jcmVhdGUoMTAsIDEwKSk7XG5wYXRoLmFkZChQb2ludC5jcmVhdGUoMTAwLCAxMCkpO1xucGF0aC5hZGQoUG9pbnQuY3JlYXRlKDEwMCwgMTAwKSk7XG5wYXRoLmFkZChQb2ludC5jcmVhdGUoMTAsIDEwMCkpO1xuXG4kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYW52YXMgPSBDYW52YXMuY3JlYXRlKCQoJ2NhbnZhcycpWzBdKTtcbiAgICBjYW52YXMuZHJhd1BhdGgocGF0aCk7XG59KTtcbiJdfQ==
