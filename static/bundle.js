(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/capabilities/object_utils/clone.js":[function(require,module,exports){
var slice = Array.prototype.slice;

function clone() {

    var newObject = {};
    for(var key in this) {
        newObject[key] = this[key]
    }

    return newObject;
}

module.exports = function(object) {

    Object.defineProperty(object, "clone", {
        enumerable: false,
        writable: true,
        value: clone
    });

    return object;
};

},{}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/object_utils/extend.js":[function(require,module,exports){
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

    Object.defineProperty(object, "extend", {
        enumerable: false,
        writable: true,
        value: extend
    });

    return object;
};

},{}],"/Users/cyrillebogaert/exp/full_capabilities/main.js":[function(require,module,exports){
require("./capabilities/object_utils/extend.js");(Object.prototype);
require("./capabilities/object_utils/clone.js")(Object.prototype);

},{"./capabilities/object_utils/clone.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/object_utils/clone.js","./capabilities/object_utils/extend.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/object_utils/extend.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvb2JqZWN0X3V0aWxzL2Nsb25lLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvb2JqZWN0X3V0aWxzL2V4dGVuZC5qcyIsIi9Vc2Vycy9jeXJpbGxlYm9nYWVydC9leHAvZnVsbF9jYXBhYmlsaXRpZXMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGNsb25lKCkge1xuXG4gICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgIGZvcih2YXIga2V5IGluIHRoaXMpIHtcbiAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB0aGlzW2tleV1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgXCJjbG9uZVwiLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGNsb25lXG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhcmcgPSBhcmdzW2ldO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBhcmdba2V5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgXCJleHRlbmRcIiwge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiBleHRlbmRcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmplY3Q7XG59O1xuIiwicmVxdWlyZShcIi4vY2FwYWJpbGl0aWVzL29iamVjdF91dGlscy9leHRlbmQuanNcIik7KE9iamVjdC5wcm90b3R5cGUpO1xucmVxdWlyZShcIi4vY2FwYWJpbGl0aWVzL29iamVjdF91dGlscy9jbG9uZS5qc1wiKShPYmplY3QucHJvdG90eXBlKTtcbiJdfQ==
