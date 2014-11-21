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
            var name = args.name;


            settings.value = function() {

                object.triggerHook('before', name, slice.call(arguments));
                var value = args.fnc.apply(this, arguments);
                object.triggerHook('after', name, slice.call(arguments));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvY2xvbmUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9kZWYuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzL2V4dGVuZC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzL2hvb2suanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBjbG9uZUNhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnY2xvbmUnLCB7XG4gICAgICAgIHZhbHVlOiBjbG9uZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcbn1cblxuXG5mdW5jdGlvbiBjbG9uZSAoKSB7XG5cbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMpIHtcbiAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB0aGlzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld09iamVjdDtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQ2FwYWJpbGl0aWVzOyIsInZhciBob29rQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ob29rLmpzJyk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxudmFyIGN1c3RvbWl6YWJsZUF0dHJzID0gWyd3cml0YWJsZScsICdjb25maWd1cmFibGUnLCAnZW51bWVyYWJsZSddO1xuXG5cbmZ1bmN0aW9uIGRlZkNhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdkZWYnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBhcmdzID0gZm9ybWF0QXJndW1lbnRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBhcmdzLnNldHRpbmdzO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBhcmdzLm5hbWU7XG5cblxuICAgICAgICAgICAgc2V0dGluZ3MudmFsdWUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIG9iamVjdC50cmlnZ2VySG9vaygnYmVmb3JlJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzLmZuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIG9iamVjdC50cmlnZ2VySG9vaygnYWZ0ZXInLCBuYW1lLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCBzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3VtZW50cyAoKSB7XG5cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmdzWzJdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZXR0aW5ncyA9IGFyZ3NbMV0uc3BsaXQoJyAnKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3VzdG9taXphYmxlQXR0cnMuaW5kZXhPZihzZXR0aW5nc1tpXSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Nbc2V0dGluZ3NbaV1dID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYXJnc1swXSxcbiAgICAgICAgZm5jOiBhcmdzWzJdIHx8IGFyZ3NbMV0sXG4gICAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xuICAgIH07XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZkNhcGFiaWxpdGllcztcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gZXZlbnRDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBvYmplY3Qub24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG5cbiAgICB2YXIgbGlzdGVuZXJzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdsaXN0ZW5lcnMnLCB7XG4gICAgICAgIHZhbHVlOiBsaXN0ZW5lcnNcbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ29uJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl0gPSBsaXN0ZW5lcnNbaWRlbnRpZmllcl0gfHwgW107XG4gICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl0ucHVzaChmbmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAncmVtb3ZlTGlzdGVuZXInLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIGluIGxpc3RlbmVycyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1tpZGVudGlmaWVyXS5zcGxpY2UobGlzdGVuZXJzW2lkZW50aWZpZXJdLmluZGV4T2YoZm5jKSwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdlbWl0Jywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiBsaXN0ZW5lcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVyc1tpZGVudGlmaWVyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl1baV0uYXBwbHkob2JqZWN0LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZW50Q2FwYWJpbGl0aWVzO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZXh0ZW5kJywge1xuICAgICAgICB2YWx1ZTogZXh0ZW5kXG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59O1xuXG5cbmZ1bmN0aW9uIGV4dGVuZCAoKSAge1xuXG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICB2YXIgYXJnID0gYXJnc1tpXTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZykge1xuICAgICAgICAgICAgdGhpc1trZXldID0gYXJnW2tleV07XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuXG59XG4iLCJmdW5jdGlvbiBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCkge1xuXG4gICAgdmFyIGhvb2tzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdob29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgcmVzdHJpY3QpIHtcbiAgICAgICAgICAgIGhvb2tzW25hbWVdID0gcmVzdHJpY3QgPyBbcmVzdHJpY3RdIDogWydhZnRlcicsICdiZWZvcmUnXTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3RyaWdnZXJIb29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obW9tZW50LCBuYW1lLCBhcmdzKSB7XG4gICAgICAgICAgICBpZiAobmFtZSBpbiBob29rcykge1xuICAgICAgICAgICAgICAgIGlmIChob29rc1tuYW1lXS5pbmRleE9mKG1vbWVudCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBbbW9tZW50ICsgJyAnICsgbmFtZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGhvb2tDYXBhYmlsaXRpZXM7XG4iLCJyZXF1aXJlKCcuL2NhcGFiaWxpdGllcy9leHRlbmQuanMnKShPYmplY3QucHJvdG90eXBlKTtcbnJlcXVpcmUoJy4vY2FwYWJpbGl0aWVzL2Nsb25lLmpzJykoT2JqZWN0LnByb3RvdHlwZSk7XG5cblxudmFyIE0gPSB7fTtcbnJlcXVpcmUoJy4vY2FwYWJpbGl0aWVzL2V2ZW50LmpzJykoTSk7XG5yZXF1aXJlKCcuL2NhcGFiaWxpdGllcy9kZWYuanMnKShNKTtcblxuTS5ob29rKCdoZWxsbycpO1xuXG5NLmRlZignaGVsbG8nLCAnZW51bWVyYWJsZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCd3b3JsZCcpO1xufSk7XG5cbk0ub24oJ2JlZm9yZSBoZWxsbycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdiZWZvcmUnLCBhcmd1bWVudHMpO1xufSk7XG5cbk0ub24oJ2FmdGVyIGhlbGxvJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ2FmdGVyJywgYXJndW1lbnRzKTtcbn0pO1xuXG5NLmhlbGxvKCk7Il19
