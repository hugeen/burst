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


var customizableAttrs = ['writable', 'configurable', 'enumerable'];

function formatArguments() {

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


module.exports = function(object) {

    hookCapabilities(object);


    Object.defineProperty(object, 'def', {
        value: function() {

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


function extend()  {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvY2xvbmUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9kZWYuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9ldmVudC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzL2V4dGVuZC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzL2hvb2suanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGNsb25lKCkge1xuXG4gICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSB7XG4gICAgICAgIG5ld09iamVjdFtrZXldID0gdGhpc1trZXldO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9uZUNhcGFiaWxpdGllcyhvYmplY3QpIHtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdjbG9uZScsIHtcbiAgICAgICAgdmFsdWU6IGNsb25lXG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBob29rQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ob29rLmpzJyk7XG5cblxudmFyIGN1c3RvbWl6YWJsZUF0dHJzID0gWyd3cml0YWJsZScsICdjb25maWd1cmFibGUnLCAnZW51bWVyYWJsZSddO1xuXG5mdW5jdGlvbiBmb3JtYXRBcmd1bWVudHMoKSB7XG5cbiAgICB2YXIgcmF3QXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuXG4gICAgdmFyIHNldHRpbmdzID0ge307XG5cbiAgICBpZiAodHlwZW9mIHJhd0FyZ3NbMl0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHNldHRpbmdzID0gcmF3QXJnc1sxXS5zcGxpdCgnICcpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2V0dGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjdXN0b21pemFibGVBdHRycy5pbmRleE9mKHNldHRpbmdzW2ldKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzZXR0aW5nc1tzZXR0aW5nc1tpXV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiByYXdBcmdzWzBdLFxuICAgICAgICBmbmM6IHJhd0FyZ3NbMl0gfHwgcmF3QXJnc1sxXSxcbiAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzXG4gICAgfTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgaG9va0NhcGFiaWxpdGllcyhvYmplY3QpO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZGVmJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBhcmdzID0gZm9ybWF0QXJndW1lbnRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBhcmdzLnNldHRpbmdzO1xuICAgICAgICAgICAgdmFyIGhvb2tzID0gb2JqZWN0Lmhvb2tzW2FyZ3MubmFtZV0gfHwgW107XG5cbiAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhvb2tzLmluZGV4T2YoJ2JlZm9yZScpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQuYXBwbHkodGhpcywgWydiZWZvcmUgJyArIGFyZ3MubmFtZV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyZ3MuZm5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaG9va3MuaW5kZXhPZignYWZ0ZXInKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmVtaXQuYXBwbHkodGhpcywgWydhZnRlciAnICsgYXJncy5uYW1lXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGFyZ3MubmFtZSwgZGVmKTtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59O1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBvYmplY3Qub24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG5cbiAgICB2YXIgbGlzdGVuZXJzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdsaXN0ZW5lcnMnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyc1tpZGVudGlmaWVyXSA9IGxpc3RlbmVyc1tpZGVudGlmaWVyXSB8fCBbXTtcbiAgICAgICAgICAgIGxpc3RlbmVyc1tpZGVudGlmaWVyXS5wdXNoKGZuYyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdvbicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdID0gbGlzdGVuZXJzW2lkZW50aWZpZXJdIHx8IFtdO1xuICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdLnB1c2goZm5jKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3JlbW92ZUxpc3RlbmVyJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiBsaXN0ZW5lcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl0uc3BsaWNlKGxpc3RlbmVyc1tpZGVudGlmaWVyXS5pbmRleE9mKGZuYyksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZW1pdCcsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgaW4gbGlzdGVuZXJzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnNbaWRlbnRpZmllcl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2lkZW50aWZpZXJdW2ldLmFwcGx5KG9iamVjdCwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn07XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxuZnVuY3Rpb24gZXh0ZW5kKCkgIHtcblxuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIGFyZyA9IGFyZ3NbaV07XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhcmcpIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGFyZ1trZXldO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2V4dGVuZCcsIHtcbiAgICAgICAgdmFsdWU6IGV4dGVuZFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgdmFyIGhvb2tzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdob29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgcmVzdHJpY3QpIHtcbiAgICAgICAgICAgIGhvb2tzW25hbWVdID0gcmVzdHJpY3QgPyBbcmVzdHJpY3RdIDogWydhZnRlcicsICdiZWZvcmUnXTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59O1xuIiwicmVxdWlyZSgnLi9jYXBhYmlsaXRpZXMvZXh0ZW5kLmpzJykoT2JqZWN0LnByb3RvdHlwZSk7XG5yZXF1aXJlKCcuL2NhcGFiaWxpdGllcy9jbG9uZS5qcycpKE9iamVjdC5wcm90b3R5cGUpO1xuXG5cbnZhciBNID0ge307XG5yZXF1aXJlKCcuL2NhcGFiaWxpdGllcy9ldmVudC5qcycpKE0pO1xucmVxdWlyZSgnLi9jYXBhYmlsaXRpZXMvZGVmLmpzJykoTSk7XG5cbk0uaG9vaygnaGVsbG8nKTtcblxuTS5kZWYoJ2hlbGxvJywgJ2VudW1lcmFibGUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnd29ybGQnKTtcbn0pO1xuXG5NLm9uKCdiZWZvcmUgaGVsbG8nLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnYmVmb3JlJywgYXJndW1lbnRzKTtcbn0pO1xuXG5NLm9uKCdhZnRlciBoZWxsbycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdhZnRlcicsIGFyZ3VtZW50cyk7XG59KTtcblxuTS5oZWxsbygpOyJdfQ==
