(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/capabilities/clone.js":[function(require,module,exports){
function cloneCapabilities (object) {

    Object.defineProperty(object, 'clone', {
        value: clone
    });

    return object;
}


function clone () {

    var newObject = {};
    for (var key in this) {
        newObject[key] = this[key];
    }

    return newObject;
}


module.exports = cloneCapabilities;
},{}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/def.js":[function(require,module,exports){
var hookCapabilities = require('./hook.js');
var slice = Array.prototype.slice;
var customizableAttrs = ['writable', 'configurable', 'enumerable'];


function defCapabilities (object) {

    hookCapabilities(object);


    Object.defineProperty(object, 'def', {
        value: function () {

            var args = formatArguments.apply(this, arguments);
            var settings = args.settings;
            var hooks = object.hooks[args.name] || [];

            settings.value = function() {
                if (hooks.indexOf('before') !== -1) {
                    this.emit.apply(this, ['before ' + args.name].concat(slice.call(arguments)));
                }

                var value = args.fnc.apply(this, arguments);

                if (hooks.indexOf('after') !== -1) {
                    object.emit.apply(this, ['after ' + args.name].concat(slice.call(arguments)));
                }

                return value;
            };

            Object.defineProperty(this, args.name, def);

        }
    });

    return object;

}


function formatArguments () {

    var rawArgs = slice.call(arguments);


    var settings = {};

    if (typeof rawArgs[2] !== 'undefined') {
        settings = rawArgs[1].split(' ');

        for (var i = 0; i < settings.length; i++) {
            if (customizableAttrs.indexOf(settings[i]) !== -1) {
                settings[settings[i]] = true;
            }
        }
    }


    return {
        name: rawArgs[0],
        fnc: rawArgs[2] || rawArgs[1],
        settings: settings
    };
}


module.exports = defCapabilities;

},{"./hook.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/hook.js"}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/event.js":[function(require,module,exports){
var slice = Array.prototype.slice;

function eventCapabilities (object) {

    if (typeof object.on !== 'undefined') {
        return object;
    }


    var listeners = {};


    Object.defineProperty(object, 'listeners', {
        value: listeners
    });


    Object.defineProperty(object, 'on', {
        value: function(identifier, fnc) {
            listeners[identifier] = listeners[identifier] || [];
            listeners[identifier].push(fnc);

            return this;
        }
    });


    Object.defineProperty(object, 'removeListener', {
        value: function(identifier, fnc) {
            if (identifier in listeners === true) {
                listeners[identifier].splice(listeners[identifier].indexOf(fnc), 1);
            }

            return this;
        }
    });


    Object.defineProperty(object, 'emit', {
        value: function(identifier, fnc) {
            if (identifier in listeners === true) {
                for (var i = 0; i < listeners[identifier].length; i++) {
                    listeners[identifier][i].apply(object, slice.call(arguments, 1));
                }
            }

            return this;
        }
    });


    return object;

}

module.exports = eventCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/extend.js":[function(require,module,exports){
var slice = Array.prototype.slice;


module.exports = function(object) {

    Object.defineProperty(object, 'extend', {
        value: extend
    });

    return object;

};


function extend ()  {

    var args = slice.call(arguments);

    for (var i = 0; i < args.length; i++) {

        var arg = args[i];
        for (var key in arg) {
            this[key] = arg[key];
        }

    }

    return this;

}

},{}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/hook.js":[function(require,module,exports){
function hookCapabilities(object) {

    var hooks = {};


    Object.defineProperty(object, 'hook', {
        value: function(name, restrict) {
            hooks[name] = restrict ? [restrict] : ['after', 'before'];
        }
    });


    return object;

}


module.exports = hookCapabilities;

},{}],"/Users/cyrillebogaert/exp/full_capabilities/main.js":[function(require,module,exports){
require('./capabilities/extend.js')(Object.prototype);
require('./capabilities/clone.js')(Object.prototype);


var M = {};
require('./capabilities/event.js')(M);
require('./capabilities/def.js')(M);

M.hook('hello');

M.def('hello', 'enumerable', function() {
    console.log('world');
});

M.on('before hello', function() {
    console.log('before', arguments);
});

M.on('after hello', function() {
    console.log('after', arguments);
});

M.hello();
},{"./capabilities/clone.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/clone.js","./capabilities/def.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/def.js","./capabilities/event.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/event.js","./capabilities/extend.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/extend.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvY2xvbmUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9kZWYuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzL2V4dGVuZC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzL2hvb2suanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBjbG9uZUNhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnY2xvbmUnLCB7XG4gICAgICAgIHZhbHVlOiBjbG9uZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcbn1cblxuXG5mdW5jdGlvbiBjbG9uZSAoKSB7XG5cbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMpIHtcbiAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB0aGlzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld09iamVjdDtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQ2FwYWJpbGl0aWVzOyIsInZhciBob29rQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ob29rLmpzJyk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgY3VzdG9taXphYmxlQXR0cnMgPSBbJ3dyaXRhYmxlJywgJ2NvbmZpZ3VyYWJsZScsICdlbnVtZXJhYmxlJ107XG5cblxuZnVuY3Rpb24gZGVmQ2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2RlZicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBmb3JtYXRBcmd1bWVudHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IGFyZ3Muc2V0dGluZ3M7XG4gICAgICAgICAgICB2YXIgaG9va3MgPSBvYmplY3QuaG9va3NbYXJncy5uYW1lXSB8fCBbXTtcblxuICAgICAgICAgICAgc2V0dGluZ3MudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoaG9va3MuaW5kZXhPZignYmVmb3JlJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBbJ2JlZm9yZSAnICsgYXJncy5uYW1lXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJncy5mbmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgICAgIGlmIChob29rcy5pbmRleE9mKCdhZnRlcicpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QuZW1pdC5hcHBseSh0aGlzLCBbJ2FmdGVyICcgKyBhcmdzLm5hbWVdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgYXJncy5uYW1lLCBkZWYpO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcmd1bWVudHMgKCkge1xuXG4gICAgdmFyIHJhd0FyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cblxuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiByYXdBcmdzWzJdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZXR0aW5ncyA9IHJhd0FyZ3NbMV0uc3BsaXQoJyAnKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3VzdG9taXphYmxlQXR0cnMuaW5kZXhPZihzZXR0aW5nc1tpXSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Nbc2V0dGluZ3NbaV1dID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogcmF3QXJnc1swXSxcbiAgICAgICAgZm5jOiByYXdBcmdzWzJdIHx8IHJhd0FyZ3NbMV0sXG4gICAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xuICAgIH07XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZDYXBhYmlsaXRpZXM7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGV2ZW50Q2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGlmICh0eXBlb2Ygb2JqZWN0Lm9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuXG4gICAgdmFyIGxpc3RlbmVycyA9IHt9O1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnbGlzdGVuZXJzJywge1xuICAgICAgICB2YWx1ZTogbGlzdGVuZXJzXG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdvbicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdID0gbGlzdGVuZXJzW2lkZW50aWZpZXJdIHx8IFtdO1xuICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdLnB1c2goZm5jKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3JlbW92ZUxpc3RlbmVyJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiBsaXN0ZW5lcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl0uc3BsaWNlKGxpc3RlbmVyc1tpZGVudGlmaWVyXS5pbmRleE9mKGZuYyksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZW1pdCcsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgaW4gbGlzdGVuZXJzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnNbaWRlbnRpZmllcl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdW2ldLmFwcGx5KG9iamVjdCwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudENhcGFiaWxpdGllcztcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2V4dGVuZCcsIHtcbiAgICAgICAgdmFsdWU6IGV4dGVuZFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufTtcblxuXG5mdW5jdGlvbiBleHRlbmQgKCkgIHtcblxuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIGFyZyA9IGFyZ3NbaV07XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhcmcpIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGFyZ1trZXldO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcblxufVxuIiwiZnVuY3Rpb24gaG9va0NhcGFiaWxpdGllcyhvYmplY3QpIHtcblxuICAgIHZhciBob29rcyA9IHt9O1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnaG9vaycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKG5hbWUsIHJlc3RyaWN0KSB7XG4gICAgICAgICAgICBob29rc1tuYW1lXSA9IHJlc3RyaWN0ID8gW3Jlc3RyaWN0XSA6IFsnYWZ0ZXInLCAnYmVmb3JlJ107XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaG9va0NhcGFiaWxpdGllcztcbiIsInJlcXVpcmUoJy4vY2FwYWJpbGl0aWVzL2V4dGVuZC5qcycpKE9iamVjdC5wcm90b3R5cGUpO1xucmVxdWlyZSgnLi9jYXBhYmlsaXRpZXMvY2xvbmUuanMnKShPYmplY3QucHJvdG90eXBlKTtcblxuXG52YXIgTSA9IHt9O1xucmVxdWlyZSgnLi9jYXBhYmlsaXRpZXMvZXZlbnQuanMnKShNKTtcbnJlcXVpcmUoJy4vY2FwYWJpbGl0aWVzL2RlZi5qcycpKE0pO1xuXG5NLmhvb2soJ2hlbGxvJyk7XG5cbk0uZGVmKCdoZWxsbycsICdlbnVtZXJhYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ3dvcmxkJyk7XG59KTtcblxuTS5vbignYmVmb3JlIGhlbGxvJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ2JlZm9yZScsIGFyZ3VtZW50cyk7XG59KTtcblxuTS5vbignYWZ0ZXIgaGVsbG8nLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnYWZ0ZXInLCBhcmd1bWVudHMpO1xufSk7XG5cbk0uaGVsbG8oKTsiXX0=
