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

User.tag('roxxor', v);
User.untag('roxxor', v);

console.log(User.roxxor);
},{"./capabilities/model.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/model.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvZGVmLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvZXZlbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvbW9kZWwuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy90YWcuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgaG9va0NhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vaG9vay5qcycpO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cbnZhciBjdXN0b21pemFibGVBdHRycyA9IFsnd3JpdGFibGUnLCAnY29uZmlndXJhYmxlJywgJ2VudW1lcmFibGUnXTtcblxuXG5mdW5jdGlvbiBkZWZDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgaG9va0NhcGFiaWxpdGllcyhvYmplY3QpO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZGVmJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgYXJncyA9IGZvcm1hdEFyZ3VtZW50cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIHNldHRpbmdzID0gYXJncy5zZXR0aW5ncztcbiAgICAgICAgICAgIHZhciBuYW1lID0gYXJncy5uYW1lO1xuXG5cbiAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJIb29rKCdiZWZvcmUnLCBuYW1lLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyZ3MuZm5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VySG9vaygnYWZ0ZXInLCBuYW1lLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCBzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3VtZW50cyAoKSB7XG5cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmdzWzJdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZXR0aW5ncyA9IGFyZ3NbMV0uc3BsaXQoJyAnKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3VzdG9taXphYmxlQXR0cnMuaW5kZXhPZihzZXR0aW5nc1tpXSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Nbc2V0dGluZ3NbaV1dID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYXJnc1swXSxcbiAgICAgICAgZm5jOiBhcmdzWzJdIHx8IGFyZ3NbMV0sXG4gICAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xuICAgIH07XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZkNhcGFiaWxpdGllcztcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gZXZlbnRDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBvYmplY3Qub24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnb24nLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGZpbmRPckNyZWF0ZUxpc3RlbmVycy5jYWxsKHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXSA9IHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0ucHVzaChmbmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAncmVtb3ZlTGlzdGVuZXInLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGZpbmRPckNyZWF0ZUxpc3RlbmVycy5jYWxsKHRoaXMpO1xuXG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLnNwbGljZSh0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5pbmRleE9mKGZuYyksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnZW1pdCcsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgZmluZE9yQ3JlYXRlTGlzdGVuZXJzLmNhbGwodGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXVtpXS5hcHBseSh0aGlzLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZpbmRPckNyZWF0ZUxpc3RlbmVycygpIHtcbiAgICBpZiAoISgnbGlzdGVuZXJzJyBpbiB0aGlzKSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2xpc3RlbmVycycsIHtcbiAgICAgICAgICAgIHZhbHVlOiB7fVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudENhcGFiaWxpdGllcztcbiIsImZ1bmN0aW9uIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KSB7XG5cbiAgICB2YXIgaG9va3MgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2hvb2snLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihuYW1lLCByZXN0cmljdCkge1xuICAgICAgICAgICAgaG9va3NbbmFtZV0gPSByZXN0cmljdCA/IFtyZXN0cmljdF0gOiBbJ2FmdGVyJywgJ2JlZm9yZSddO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICd0cmlnZ2VySG9vaycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKG1vbWVudCwgbmFtZSwgYXJncykge1xuXG4gICAgICAgICAgICBpZiAobmFtZSBpbiBob29rcykge1xuICAgICAgICAgICAgICAgIGlmIChob29rc1tuYW1lXS5pbmRleE9mKG1vbWVudCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBbbW9tZW50ICsgJyAnICsgbmFtZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBob29rQ2FwYWJpbGl0aWVzO1xuIiwidmFyIGV2ZW50Q2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ldmVudC5qcycpO1xudmFyIGRlZkNhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vZGVmLmpzJyk7XG52YXIgdGFnQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi90YWcuanMnKTtcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cbmZ1bmN0aW9uIG1vZGVsQ2FwYWJpbGl0aWVzIChNb2RlbCkge1xuXG4gICAgYWRkQ2FwYWJpbGl0aWVzLmNhbGwoTW9kZWwsIFtcbiAgICAgICAgZXZlbnRDYXBhYmlsaXRpZXMsXG4gICAgICAgIGRlZkNhcGFiaWxpdGllcyxcbiAgICAgICAgdGFnQ2FwYWJpbGl0aWVzXG4gICAgXSk7XG5cbiAgICBhZGRDYXBhYmlsaXRpZXMuY2FsbChNb2RlbC5wcm90b3R5cGUsIFtcbiAgICAgICAgZXZlbnRDYXBhYmlsaXRpZXMsXG4gICAgICAgIGRlZkNhcGFiaWxpdGllc1xuICAgIF0pO1xuXG5cbiAgICBNb2RlbC5ob29rKCdjcmVhdGUnKTtcblxuICAgIE1vZGVsLmRlZignY3JlYXRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKE1vZGVsLnByb3RvdHlwZSk7XG4gICAgICAgIE1vZGVsLmFwcGx5KGluc3RhbmNlLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIE1vZGVsO1xuXG59XG5cblxuZnVuY3Rpb24gYWRkQ2FwYWJpbGl0aWVzKGRlc3RpbmF0aW9ucykge1xuICAgIGZvciAodmFyIGkgaW4gZGVzdGluYXRpb25zKSB7XG4gICAgICAgIGRlc3RpbmF0aW9uc1tpXSh0aGlzKTtcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBtb2RlbENhcGFiaWxpdGllcztcbiIsImZ1bmN0aW9uIHRhZ0NhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICB2YXIgdGFncyA9IHt9O1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndGFnJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKG5hbWUsIGVudGl0eSkge1xuXG4gICAgICAgICAgICB2YXIgdGFnID0gZmluZE9yQ3JlYXRlVGFnLmNhbGwodGhpcywgdGFncywgbmFtZSk7XG4gICAgICAgICAgICByZWZlcmVuY2VUYWdOYW1lKG5hbWUsIGVudGl0eSk7XG5cbiAgICAgICAgICAgIHRhZy5wdXNoKGVudGl0eSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICd1bnRhZycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChuYW1lLCBlbnRpdHkpIHtcblxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gdGFncykge1xuICAgICAgICAgICAgICAgIHRhZ3NbbmFtZV0uc3BsaWNlKHRhZ3NbbmFtZV0uaW5kZXhPZihlbnRpdHkpLCAxKTtcbiAgICAgICAgICAgICAgICBlbnRpdHkudGFnZ2VkSW4uc3BsaWNlKGVudGl0eS50YWdnZWRJbi5pbmRleE9mKG5hbWUpLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZpbmRPckNyZWF0ZVRhZyAodGFncywgbmFtZSkge1xuXG4gICAgaWYgKCEobmFtZSBpbiB0YWdzKSkge1xuICAgICAgICB0YWdzW25hbWVdID0gW107XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgICAgICB2YWx1ZTogdGFnc1tuYW1lXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFnc1tuYW1lXTtcblxufVxuXG5cbmZ1bmN0aW9uIHJlZmVyZW5jZVRhZ05hbWUgKG5hbWUsIGVudGl0eSkge1xuXG4gICAgaWYgKCEoJ3RhZ2dlZEluJyBpbiBlbnRpdHkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbnRpdHksICd0YWdnZWRJbicsIHtcbiAgICAgICAgICAgIHZhbHVlOiBbXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZW50aXR5LnRhZ2dlZEluLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICAgIGVudGl0eS50YWdnZWRJbi5wdXNoKG5hbWUpO1xuICAgIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gdGFnQ2FwYWJpbGl0aWVzO1xuIiwicmVxdWlyZSgnLi9jYXBhYmlsaXRpZXMvbW9kZWwuanMnKShVc2VyKTtcblxuZnVuY3Rpb24gVXNlcihwYXJhbXMpIHtcbiAgICB0aGlzLm5hbWUgPSBwYXJhbXMubmFtZTtcbn1cblxuVXNlci5wcm90b3R5cGUuaG9vaygnYml0Y2gnKTtcblVzZXIucHJvdG90eXBlLmRlZignYml0Y2gnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLCAnYml0Y2gnKTtcbn0pO1xuXG52YXIgcGFyYW1zID0ge1xuICAgIG5hbWU6ICdDeXJpbGxlJ1xufTtcblxudmFyIHUgPSBVc2VyLmNyZWF0ZShwYXJhbXMpO1xudmFyIHYgPSBVc2VyLmNyZWF0ZShwYXJhbXMpO1xuXG52Lm9uKCdoZWxsbycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdoZWxsbycsIHRoaXMpO1xufSk7XG5cblxudS5lbWl0KCdoZWxsbycpO1xudi5lbWl0KCdoZWxsbycpO1xuXG5cbnYub24oJ2JlZm9yZSBiaXRjaCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdiZWZvcmUgYml0Y2gnLCB0aGlzKTtcbn0pO1xudi5iaXRjaCgpO1xuXG5Vc2VyLnRhZygncm94eG9yJywgdik7XG5Vc2VyLnVudGFnKCdyb3h4b3InLCB2KTtcblxuY29uc29sZS5sb2coVXNlci5yb3h4b3IpOyJdfQ==
