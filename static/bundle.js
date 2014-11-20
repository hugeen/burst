(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/capabilities/clone.js":[function(require,module,exports){
function clone() {

    var newObject = {};
    for (var key in this) {
        newObject[key] = this[key];
    }

    return newObject;
}


module.exports = function cloneCapabilities(object) {

    Object.defineProperty(object, 'clone', {
        value: clone
    });

    return object;
};

},{}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/def.js":[function(require,module,exports){
var slice = Array.prototype.slice;
var hookCapabilities = require('./hook.js');
var customAttrs = ['writable', 'configurable', 'enumerable'];

function formatArguments() {
    var rawArgs = slice.call(arguments);
    var args = {
        name: rawArgs[0],
        settings: {},
        fnc: rawArgs[2] || rawArgs[1]
    };

    if (typeof rawArgs[2] !== 'undefined') {
        var settings = rawArgs[1].split(' ');
        for (var i = 0; i < settings.length; i++) {
            if (customAttrs.indexOf(settings[i]) !== -1) {
                args.settings[settings[i]] = true;
            }
        }
    }

    return args;
}

module.exports = function(object) {

    hookCapabilities(object);

    Object.defineProperty(object, 'def', {
        value: function() {

            var args = formatArguments.apply(object, arguments);
            var def = args.settings;
            var hooks = object.hooks[args.name] || [];

            def.value = function() {
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

};

},{"./hook.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/hook.js"}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/event.js":[function(require,module,exports){
var slice = Array.prototype.slice;

module.exports = function(object) {

    if (typeof object.on !== 'undefined') {
        return object;
    }


    var listeners = {};


    Object.defineProperty(object, 'listeners', {
        value: function(identifier, fnc) {
            listeners[identifier] = listeners[identifier] || [];
            listeners[identifier].push(fnc);

            return this;
        }
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

};

},{}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/extend.js":[function(require,module,exports){
var slice = Array.prototype.slice;

function extend() {

    var args = slice.call(arguments);

    for (var i = 0; i < args.length; i++) {

        var arg = args[i];
        for (var key in arg) {
            this[key] = arg[key];
        }

    }

    return this;
}


module.exports = function(object) {

    Object.defineProperty(object, 'extend', {
        value: extend
    });

    return object;
};

},{}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/hook.js":[function(require,module,exports){
module.exports = function(object) {

    var hooks = {};


    Object.defineProperty(object, 'hook', {
        value: function(name, restrict) {
            hooks[name] = restrict ? [restrict] : ['after', 'before'];
        }
    });


    return object;

};

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvY2xvbmUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9kZWYuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzL2V4dGVuZC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzL2hvb2suanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBjbG9uZSgpIHtcblxuICAgIHZhciBuZXdPYmplY3QgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcykge1xuICAgICAgICBuZXdPYmplY3Rba2V5XSA9IHRoaXNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvbmVDYXBhYmlsaXRpZXMob2JqZWN0KSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnY2xvbmUnLCB7XG4gICAgICAgIHZhbHVlOiBjbG9uZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgaG9va0NhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vaG9vay5qcycpO1xudmFyIGN1c3RvbUF0dHJzID0gWyd3cml0YWJsZScsICdjb25maWd1cmFibGUnLCAnZW51bWVyYWJsZSddO1xuXG5mdW5jdGlvbiBmb3JtYXRBcmd1bWVudHMoKSB7XG4gICAgdmFyIHJhd0FyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGFyZ3MgPSB7XG4gICAgICAgIG5hbWU6IHJhd0FyZ3NbMF0sXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgZm5jOiByYXdBcmdzWzJdIHx8IHJhd0FyZ3NbMV1cbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiByYXdBcmdzWzJdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgc2V0dGluZ3MgPSByYXdBcmdzWzFdLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2V0dGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjdXN0b21BdHRycy5pbmRleE9mKHNldHRpbmdzW2ldKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnNldHRpbmdzW3NldHRpbmdzW2ldXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJncztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QpIHtcblxuICAgIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdkZWYnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBmb3JtYXRBcmd1bWVudHMuYXBwbHkob2JqZWN0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGRlZiA9IGFyZ3Muc2V0dGluZ3M7XG4gICAgICAgICAgICB2YXIgaG9va3MgPSBvYmplY3QuaG9va3NbYXJncy5uYW1lXSB8fCBbXTtcblxuICAgICAgICAgICAgZGVmLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhvb2tzLmluZGV4T2YoJ2JlZm9yZScpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQuYXBwbHkodGhpcywgWydiZWZvcmUgJyArIGFyZ3MubmFtZV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyZ3MuZm5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaG9va3MuaW5kZXhPZignYWZ0ZXInKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmVtaXQuYXBwbHkodGhpcywgWydhZnRlciAnICsgYXJncy5uYW1lXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGFyZ3MubmFtZSwgZGVmKTtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59O1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBvYmplY3Qub24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG5cbiAgICB2YXIgbGlzdGVuZXJzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdsaXN0ZW5lcnMnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyc1tpZGVudGlmaWVyXSA9IGxpc3RlbmVyc1tpZGVudGlmaWVyXSB8fCBbXTtcbiAgICAgICAgICAgIGxpc3RlbmVyc1tpZGVudGlmaWVyXS5wdXNoKGZuYyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdvbicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdID0gbGlzdGVuZXJzW2lkZW50aWZpZXJdIHx8IFtdO1xuICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdLnB1c2goZm5jKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3JlbW92ZUxpc3RlbmVyJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiBsaXN0ZW5lcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl0uc3BsaWNlKGxpc3RlbmVyc1tpZGVudGlmaWVyXS5pbmRleE9mKGZuYyksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZW1pdCcsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgaW4gbGlzdGVuZXJzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnNbaWRlbnRpZmllcl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdW2ldLmFwcGx5KG9iamVjdCwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn07XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcblxuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIGFyZyA9IGFyZ3NbaV07XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhcmcpIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGFyZ1trZXldO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2V4dGVuZCcsIHtcbiAgICAgICAgdmFsdWU6IGV4dGVuZFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgdmFyIGhvb2tzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdob29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgcmVzdHJpY3QpIHtcbiAgICAgICAgICAgIGhvb2tzW25hbWVdID0gcmVzdHJpY3QgPyBbcmVzdHJpY3RdIDogWydhZnRlcicsICdiZWZvcmUnXTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59O1xuIiwicmVxdWlyZSgnLi9jYXBhYmlsaXRpZXMvZXh0ZW5kLmpzJykoT2JqZWN0LnByb3RvdHlwZSk7XG5yZXF1aXJlKCcuL2NhcGFiaWxpdGllcy9jbG9uZS5qcycpKE9iamVjdC5wcm90b3R5cGUpO1xuXG5cbnZhciBNID0ge307XG5yZXF1aXJlKCcuL2NhcGFiaWxpdGllcy9ldmVudC5qcycpKE0pO1xucmVxdWlyZSgnLi9jYXBhYmlsaXRpZXMvZGVmLmpzJykoTSk7XG5cbk0uaG9vaygnaGVsbG8nKTtcblxuTS5kZWYoJ2hlbGxvJywgJ2VudW1lcmFibGUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnd29ybGQnKTtcbn0pO1xuXG5NLm9uKCdiZWZvcmUgaGVsbG8nLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnYmVmb3JlJywgYXJndW1lbnRzKTtcbn0pO1xuXG5NLm9uKCdhZnRlciBoZWxsbycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdhZnRlcicsIGFyZ3VtZW50cyk7XG59KTtcblxuTS5oZWxsbygpOyJdfQ==
