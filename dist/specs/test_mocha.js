(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
require('es6-weak-map/implement');
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getListenable = getListenable;
exports.getListeners = getListeners;
exports.on = on;
exports.removeListener = removeListener;
exports.emit = emit;
exports.globalOn = globalOn;
exports.globalEmit = globalEmit;
exports.globalRemoveListener = globalRemoveListener;
var listenableMap = new WeakMap();

function getListenable(object) {
    if (!listenableMap.has(object)) {
        listenableMap.set(object, {});
    }

    return listenableMap.get(object);
}

;

function getListeners(object, identifier) {
    var listenable = getListenable(object);
    listenable[identifier] = listenable[identifier] || [];

    return listenable[identifier];
}

;

function on(object, identifier, listener) {
    var listeners = getListeners(object, identifier);

    listeners.push(listener);

    globalEmit('listener added', object, identifier, listener);
}

;

function removeListener(object, identifier, listener) {
    var listeners = getListeners(object, identifier);

    var index = listeners.indexOf(listener);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    globalEmit('listener removed', object, identifier, listener);
}

;

function emit(object, identifier) {
    var listeners = getListeners(object, identifier);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var listener = _step.value;

            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            listener.apply(object, args);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

;

var globalEvents = {};

exports.globalEvents = globalEvents;

function globalOn(identifier, listener) {
    on(globalEvents, identifier, listener);
}

;

function globalEmit(identifier) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
    }

    emit.apply(undefined, [globalEvents, identifier].concat(args));
}

;

function globalRemoveListener(identifier, listener) {
    removeListener(globalEvents, identifier, listener);
}

;

},{}],2:[function(require,module,exports){
'use strict';

var _libCoreEvent = require('../lib/core/event');

// importing a module

describe('something', function () {
  // using the arrow function
  it('that should work', function () {
    console.log(_libCoreEvent.on);
  });
});

},{"../lib/core/event":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2J1cnN0L2xpYi9jb3JlL2V2ZW50LmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9idXJzdC9zcGVjcy90ZXN0X21vY2hhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7UUNHZ0IsYUFBYSxHQUFiLGFBQWE7UUFTYixZQUFZLEdBQVosWUFBWTtRQVFaLEVBQUUsR0FBRixFQUFFO1FBU0YsY0FBYyxHQUFkLGNBQWM7UUFZZCxJQUFJLEdBQUosSUFBSTtRQVlKLFFBQVEsR0FBUixRQUFRO1FBS1IsVUFBVSxHQUFWLFVBQVU7UUFLVixvQkFBb0IsR0FBcEIsb0JBQW9CO0FBL0RwQyxJQUFJLGFBQWEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDOztBQUczQixTQUFTLGFBQWEsQ0FBRSxNQUFNLEVBQUU7QUFDbkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDNUIscUJBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2pDOztBQUVELFdBQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUNwQzs7QUFBQSxDQUFDOztBQUdLLFNBQVMsWUFBWSxDQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUU7QUFDOUMsUUFBSSxVQUFVLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZDLGNBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUV0RCxXQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztDQUNqQzs7QUFBQSxDQUFDOztBQUdLLFNBQVMsRUFBRSxDQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQ2pELFFBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7O0FBRTlDLGFBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXpCLGNBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQzlEOztBQUFBLENBQUM7O0FBR0ssU0FBUyxjQUFjLENBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7QUFDMUQsUUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFakQsUUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxRQUFHLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNiLGlCQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM5Qjs7QUFFRCxjQUFVLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztDQUNoRTs7QUFBQSxDQUFDOztBQUdLLFNBQVMsSUFBSSxDQUFFLE1BQU0sRUFBRSxVQUFVLEVBQVc7QUFDL0MsUUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQzs7Ozs7OztBQUVqRCw2QkFBcUIsU0FBUyw4SEFBRTtnQkFBdkIsUUFBUTs7OENBSHdCLElBQUk7QUFBSixvQkFBSTs7O0FBSXpDLG9CQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNoQzs7Ozs7Ozs7Ozs7Ozs7O0NBQ0o7O0FBQUEsQ0FBQzs7QUFHSyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7O1FBQWxCLFlBQVksR0FBWixZQUFZOztBQUdoQixTQUFTLFFBQVEsQ0FBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzVDLE1BQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQzFDOztBQUFBLENBQUM7O0FBR0ssU0FBUyxVQUFVLENBQUUsVUFBVSxFQUFXO3VDQUFOLElBQUk7QUFBSixZQUFJOzs7QUFDOUMsUUFBSSxtQkFBQyxZQUFZLEVBQUUsVUFBVSxTQUFLLElBQUksRUFBQyxDQUFDO0NBQ3hDOztBQUFBLENBQUM7O0FBR0ssU0FBUyxvQkFBb0IsQ0FBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzNELGtCQUFjLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztDQUNuRDs7QUFBQSxDQUFDOzs7Ozs0QkNqRWUsbUJBQW1COzs7O0FBRXBDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTs7QUFDMUIsSUFBRSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDM0IsV0FBTyxDQUFDLEdBQUcsZUFKUCxFQUFFLENBSVMsQ0FBQztHQUNqQixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGxpc3RlbmFibGVNYXAgPSBuZXcgV2Vha01hcCgpO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0ZW5hYmxlIChvYmplY3QpIHtcbiAgICBpZiAoIWxpc3RlbmFibGVNYXAuaGFzKG9iamVjdCkpIHtcbiAgICAgICAgbGlzdGVuYWJsZU1hcC5zZXQob2JqZWN0LCB7fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3RlbmFibGVNYXAuZ2V0KG9iamVjdCk7XG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMgKG9iamVjdCwgaWRlbnRpZmllcikge1xuICAgIHZhciBsaXN0ZW5hYmxlID0gZ2V0TGlzdGVuYWJsZShvYmplY3QpO1xuICAgIGxpc3RlbmFibGVbaWRlbnRpZmllcl0gPSBsaXN0ZW5hYmxlW2lkZW50aWZpZXJdIHx8IFtdO1xuXG4gICAgcmV0dXJuIGxpc3RlbmFibGVbaWRlbnRpZmllcl07XG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBvbiAob2JqZWN0LCBpZGVudGlmaWVyLCBsaXN0ZW5lcikge1xuXHR2YXIgbGlzdGVuZXJzID0gZ2V0TGlzdGVuZXJzKG9iamVjdCwgaWRlbnRpZmllcik7XG5cbiAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICBnbG9iYWxFbWl0KCdsaXN0ZW5lciBhZGRlZCcsIG9iamVjdCwgaWRlbnRpZmllciwgbGlzdGVuZXIpO1xufTtcblxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIgKG9iamVjdCwgaWRlbnRpZmllciwgbGlzdGVuZXIpIHtcbiAgICB2YXIgbGlzdGVuZXJzID0gZ2V0TGlzdGVuZXJzKG9iamVjdCwgaWRlbnRpZmllcik7XG5cbiAgICB2YXIgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgaWYoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIGdsb2JhbEVtaXQoJ2xpc3RlbmVyIHJlbW92ZWQnLCBvYmplY3QsIGlkZW50aWZpZXIsIGxpc3RlbmVyKTtcbn07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGVtaXQgKG9iamVjdCwgaWRlbnRpZmllciwgLi4uYXJncykge1xuICAgIHZhciBsaXN0ZW5lcnMgPSBnZXRMaXN0ZW5lcnMob2JqZWN0LCBpZGVudGlmaWVyKTtcblxuICAgIGZvciAodmFyIGxpc3RlbmVyIG9mIGxpc3RlbmVycykge1xuICAgICAgICBsaXN0ZW5lci5hcHBseShvYmplY3QsIGFyZ3MpO1xuICAgIH1cbn07XG5cblxuZXhwb3J0IHZhciBnbG9iYWxFdmVudHMgPSB7fTtcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsT24gKGlkZW50aWZpZXIsIGxpc3RlbmVyKSB7XG4gICAgb24oZ2xvYmFsRXZlbnRzLCBpZGVudGlmaWVyLCBsaXN0ZW5lcik7XG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxFbWl0IChpZGVudGlmaWVyLCAuLi5hcmdzKSB7XG5cdGVtaXQoZ2xvYmFsRXZlbnRzLCBpZGVudGlmaWVyLCAuLi5hcmdzKTtcbn07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbFJlbW92ZUxpc3RlbmVyIChpZGVudGlmaWVyLCBsaXN0ZW5lcikge1xuXHRyZW1vdmVMaXN0ZW5lcihnbG9iYWxFdmVudHMsIGlkZW50aWZpZXIsIGxpc3RlbmVyKTtcbn07XG4iLCJpbXBvcnQge29ufSBmcm9tICcuLi9saWIvY29yZS9ldmVudCcgLy8gaW1wb3J0aW5nIGEgbW9kdWxlXG5cbmRlc2NyaWJlKCdzb21ldGhpbmcnLCAoKSA9PiB7IC8vIHVzaW5nIHRoZSBhcnJvdyBmdW5jdGlvblxuICBpdCgndGhhdCBzaG91bGQgd29yaycsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhvbik7XG4gIH0pO1xufSk7XG4iXX0=
