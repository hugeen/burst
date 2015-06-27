(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConsoleWrapper = (function () {
	function ConsoleWrapper() {
		_classCallCheck(this, ConsoleWrapper);
	}

	_createClass(ConsoleWrapper, [{
		key: "speak",
		value: function speak() {
			debugger;
			console.log("Hello, I am ", this);
		}
	}]);

	return ConsoleWrapper;
})();

module.exports = ConsoleWrapper;

},{}],2:[function(require,module,exports){
//main.js
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _importsConsoleWrapper = require("./imports/ConsoleWrapper");

var _importsConsoleWrapper2 = _interopRequireDefault(_importsConsoleWrapper);

var x = new _importsConsoleWrapper2["default"]();
x.speak();

},{"./imports/ConsoleWrapper":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2J1cnN0L2ltcG9ydHMvQ29uc29sZVdyYXBwZXIuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2J1cnN0L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7SUNBTSxjQUFjO1VBQWQsY0FBYzt3QkFBZCxjQUFjOzs7Y0FBZCxjQUFjOztTQUNkLGlCQUFFO0FBQ04sWUFBUztBQUNULFVBQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQ2xDOzs7UUFKSSxjQUFjOzs7QUFPcEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7Ozs7Ozs7O3FDQ05MLDBCQUEwQjs7OztBQUVyRCxJQUFJLENBQUMsR0FBRyx3Q0FBb0IsQ0FBQztBQUM3QixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQ29uc29sZVdyYXBwZXJ7XG5cdHNwZWFrKCl7XG5cdFx0ZGVidWdnZXI7XG5cdFx0Y29uc29sZS5sb2coXCJIZWxsbywgSSBhbSBcIiwgdGhpcyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25zb2xlV3JhcHBlcjsiLCIvL21haW4uanNcbmltcG9ydCBDb25zb2xlV3JhcHBlciBmcm9tIFwiLi9pbXBvcnRzL0NvbnNvbGVXcmFwcGVyXCI7XG5cbnZhciB4ID0gbmV3IENvbnNvbGVXcmFwcGVyKCk7XG54LnNwZWFrKCk7Il19
