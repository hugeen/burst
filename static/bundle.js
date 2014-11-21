(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cyrillebogaert/exp/full_capabilities/capabilities/def.js":[function(require,module,exports){
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

},{"./hook.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/hook.js"}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/event.js":[function(require,module,exports){
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

},{}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/model.js":[function(require,module,exports){
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

},{"./def.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/def.js","./event.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/event.js","./tag.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/tag.js"}],"/Users/cyrillebogaert/exp/full_capabilities/capabilities/tag.js":[function(require,module,exports){
function tagCapabilities (object) {

    var tags = {};


    Object.defineProperty(object, 'tag', {
        value: function (name, entity) {

            var tag = findOrCreateTag(tags);
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


function createTag(tags) {

    if (name in tags) {
        tags[name] = [];
    }

    return tags[name];

}


function referenceTagName(name, entity) {

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

},{}],"/Users/cyrillebogaert/exp/full_capabilities/main.js":[function(require,module,exports){
require('./capabilities/model.js')(User);

function User(params) {
    this.name = params.name;
}

User.prototype.hook('bitch');
User.prototype.def('bitch', function() {
    console.log(this, 'bitch');
});

var params = {
    name: 'Cyrille'
};

var u = User.create(params);
var v = User.create(params);

v.on('hello', function() {
    console.log('hello', this);
});


u.emit('hello');
v.emit('hello');


v.on('before bitch', function() {
    console.log('before bitch', this);
});
v.bitch();

},{"./capabilities/model.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/model.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvZGVmLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvZXZlbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvbW9kZWwuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy90YWcuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGhvb2tDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2hvb2suanMnKTtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG52YXIgY3VzdG9taXphYmxlQXR0cnMgPSBbJ3dyaXRhYmxlJywgJ2NvbmZpZ3VyYWJsZScsICdlbnVtZXJhYmxlJ107XG5cblxuZnVuY3Rpb24gZGVmQ2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2RlZicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBmb3JtYXRBcmd1bWVudHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IGFyZ3Muc2V0dGluZ3M7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGFyZ3MubmFtZTtcblxuXG4gICAgICAgICAgICBzZXR0aW5ncy52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VySG9vaygnYmVmb3JlJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzLmZuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckhvb2soJ2FmdGVyJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgc2V0dGluZ3MpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcmd1bWVudHMgKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgc2V0dGluZ3MgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgYXJnc1syXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2V0dGluZ3MgPSBhcmdzWzFdLnNwbGl0KCcgJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXR0aW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGN1c3RvbWl6YWJsZUF0dHJzLmluZGV4T2Yoc2V0dGluZ3NbaV0pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzW3NldHRpbmdzW2ldXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGFyZ3NbMF0sXG4gICAgICAgIGZuYzogYXJnc1syXSB8fCBhcmdzWzFdLFxuICAgICAgICBzZXR0aW5nczogc2V0dGluZ3NcbiAgICB9O1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZDYXBhYmlsaXRpZXM7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGV2ZW50Q2FwYWJpbGl0aWVzIChvYmplY3QpIHtcblxuICAgIGlmICh0eXBlb2Ygb2JqZWN0Lm9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ29uJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0gPSB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXSB8fCBbXTtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLnB1c2goZm5jKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3JlbW92ZUxpc3RlbmVyJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5zcGxpY2UodGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0uaW5kZXhPZihmbmMpLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2VtaXQnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGZpbmRPckNyZWF0ZUxpc3RlbmVycy5jYWxsKHRoaXMpO1xuXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl1baV0uYXBwbHkodGhpcywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5mdW5jdGlvbiBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKCEoJ2xpc3RlbmVycycgaW4gdGhpcykpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdsaXN0ZW5lcnMnLCB7XG4gICAgICAgICAgICB2YWx1ZToge31cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCkge1xuXG4gICAgdmFyIGhvb2tzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdob29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgcmVzdHJpY3QpIHtcbiAgICAgICAgICAgIGhvb2tzW25hbWVdID0gcmVzdHJpY3QgPyBbcmVzdHJpY3RdIDogWydhZnRlcicsICdiZWZvcmUnXTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndHJpZ2dlckhvb2snLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihtb21lbnQsIG5hbWUsIGFyZ3MpIHtcblxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gaG9va3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoaG9va3NbbmFtZV0uaW5kZXhPZihtb21lbnQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQuYXBwbHkodGhpcywgW21vbWVudCArICcgJyArIG5hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaG9va0NhcGFiaWxpdGllcztcbiIsInZhciBldmVudENhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vZXZlbnQuanMnKTtcbnZhciBkZWZDYXBhYmlsaXRpZXMgPSByZXF1aXJlKCcuL2RlZi5qcycpO1xudmFyIHRhZ0NhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vdGFnLmpzJyk7XG5cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuXG5mdW5jdGlvbiBtb2RlbENhcGFiaWxpdGllcyAoTW9kZWwpIHtcblxuICAgIGFkZENhcGFiaWxpdGllcy5jYWxsKE1vZGVsLCBbXG4gICAgICAgIGV2ZW50Q2FwYWJpbGl0aWVzLFxuICAgICAgICBkZWZDYXBhYmlsaXRpZXMsXG4gICAgICAgIHRhZ0NhcGFiaWxpdGllc1xuICAgIF0pO1xuXG4gICAgYWRkQ2FwYWJpbGl0aWVzLmNhbGwoTW9kZWwucHJvdG90eXBlLCBbXG4gICAgICAgIGV2ZW50Q2FwYWJpbGl0aWVzLFxuICAgICAgICBkZWZDYXBhYmlsaXRpZXNcbiAgICBdKTtcblxuXG4gICAgTW9kZWwuaG9vaygnY3JlYXRlJyk7XG5cbiAgICBNb2RlbC5kZWYoJ2NyZWF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShNb2RlbC5wcm90b3R5cGUpO1xuICAgICAgICBNb2RlbC5hcHBseShpbnN0YW5jZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBNb2RlbDtcblxufVxuXG5cbmZ1bmN0aW9uIGFkZENhcGFiaWxpdGllcyhkZXN0aW5hdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpIGluIGRlc3RpbmF0aW9ucykge1xuICAgICAgICBkZXN0aW5hdGlvbnNbaV0odGhpcyk7XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gbW9kZWxDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiB0YWdDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgdmFyIHRhZ3MgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3RhZycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChuYW1lLCBlbnRpdHkpIHtcblxuICAgICAgICAgICAgdmFyIHRhZyA9IGZpbmRPckNyZWF0ZVRhZyh0YWdzKTtcbiAgICAgICAgICAgIHJlZmVyZW5jZVRhZ05hbWUobmFtZSwgZW50aXR5KTtcblxuICAgICAgICAgICAgdGFnLnB1c2goZW50aXR5KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3VudGFnJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKG5hbWUsIGVudGl0eSkge1xuXG4gICAgICAgICAgICBpZiAobmFtZSBpbiB0YWdzKSB7XG4gICAgICAgICAgICAgICAgdGFnc1tuYW1lXS5zcGxpY2UodGFnc1tuYW1lXS5pbmRleE9mKGVudGl0eSksIDEpO1xuICAgICAgICAgICAgICAgIGVudGl0eS50YWdnZWRJbi5zcGxpY2UoZW50aXR5LnRhZ2dlZEluLmluZGV4T2YobmFtZSksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxuZnVuY3Rpb24gY3JlYXRlVGFnKHRhZ3MpIHtcblxuICAgIGlmIChuYW1lIGluIHRhZ3MpIHtcbiAgICAgICAgdGFnc1tuYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiB0YWdzW25hbWVdO1xuXG59XG5cblxuZnVuY3Rpb24gcmVmZXJlbmNlVGFnTmFtZShuYW1lLCBlbnRpdHkpIHtcblxuICAgIGlmICghKCd0YWdnZWRJbicgaW4gZW50aXR5KSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW50aXR5LCAndGFnZ2VkSW4nLCB7XG4gICAgICAgICAgICB2YWx1ZTogW11cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eS50YWdnZWRJbi5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgICBlbnRpdHkudGFnZ2VkSW4ucHVzaChuYW1lKTtcbiAgICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhZ0NhcGFiaWxpdGllcztcbiIsInJlcXVpcmUoJy4vY2FwYWJpbGl0aWVzL21vZGVsLmpzJykoVXNlcik7XG5cbmZ1bmN0aW9uIFVzZXIocGFyYW1zKSB7XG4gICAgdGhpcy5uYW1lID0gcGFyYW1zLm5hbWU7XG59XG5cblVzZXIucHJvdG90eXBlLmhvb2soJ2JpdGNoJyk7XG5Vc2VyLnByb3RvdHlwZS5kZWYoJ2JpdGNoJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2codGhpcywgJ2JpdGNoJyk7XG59KTtcblxudmFyIHBhcmFtcyA9IHtcbiAgICBuYW1lOiAnQ3lyaWxsZSdcbn07XG5cbnZhciB1ID0gVXNlci5jcmVhdGUocGFyYW1zKTtcbnZhciB2ID0gVXNlci5jcmVhdGUocGFyYW1zKTtcblxudi5vbignaGVsbG8nLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnaGVsbG8nLCB0aGlzKTtcbn0pO1xuXG5cbnUuZW1pdCgnaGVsbG8nKTtcbnYuZW1pdCgnaGVsbG8nKTtcblxuXG52Lm9uKCdiZWZvcmUgYml0Y2gnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnYmVmb3JlIGJpdGNoJywgdGhpcyk7XG59KTtcbnYuYml0Y2goKTtcbiJdfQ==
