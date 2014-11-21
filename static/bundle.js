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
        console.log('hello');
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

var v = User.create(params);

v.on('before bitch', function() {
    console.log('before bitch', this);
});

v.bitch();

User.tag('roxxor', v);
User.untag('roxxor', v);

console.log(User.roxxor);
},{"./capabilities/model.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/model.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvZGVmLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvZXZlbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvbW9kZWwuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy90YWcuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBob29rQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ob29rLmpzJyk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxudmFyIGN1c3RvbWl6YWJsZUF0dHJzID0gWyd3cml0YWJsZScsICdjb25maWd1cmFibGUnLCAnZW51bWVyYWJsZSddO1xuXG5cbmZ1bmN0aW9uIGRlZkNhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdkZWYnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBhcmdzID0gZm9ybWF0QXJndW1lbnRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBhcmdzLnNldHRpbmdzO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBhcmdzLm5hbWU7XG5cblxuICAgICAgICAgICAgc2V0dGluZ3MudmFsdWUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckhvb2soJ2JlZm9yZScsIG5hbWUsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJncy5mbmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJIb29rKCdhZnRlcicsIG5hbWUsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHNldHRpbmdzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJndW1lbnRzICgpIHtcblxuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgdmFyIHNldHRpbmdzID0ge307XG5cbiAgICBpZiAodHlwZW9mIGFyZ3NbMl0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHNldHRpbmdzID0gYXJnc1sxXS5zcGxpdCgnICcpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2V0dGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjdXN0b21pemFibGVBdHRycy5pbmRleE9mKHNldHRpbmdzW2ldKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzZXR0aW5nc1tzZXR0aW5nc1tpXV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBhcmdzWzBdLFxuICAgICAgICBmbmM6IGFyZ3NbMl0gfHwgYXJnc1sxXSxcbiAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzXG4gICAgfTtcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVmQ2FwYWJpbGl0aWVzO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBldmVudENhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICBpZiAodHlwZW9mIG9iamVjdC5vbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdvbicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgZmluZE9yQ3JlYXRlTGlzdGVuZXJzLmNhbGwodGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdID0gdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0gfHwgW107XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpZGVudGlmaWVyXS5wdXNoKGZuYyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdyZW1vdmVMaXN0ZW5lcicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICAgICAgZmluZE9yQ3JlYXRlTGlzdGVuZXJzLmNhbGwodGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaWRlbnRpZmllcl0uc3BsaWNlKHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLmluZGV4T2YoZm5jKSwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdlbWl0Jywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBmaW5kT3JDcmVhdGVMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2lkZW50aWZpZXJdW2ldLmFwcGx5KHRoaXMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxuZnVuY3Rpb24gZmluZE9yQ3JlYXRlTGlzdGVuZXJzKCkge1xuICAgIGlmICghKCdsaXN0ZW5lcnMnIGluIHRoaXMpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoZWxsbycpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2xpc3RlbmVycycsIHtcbiAgICAgICAgICAgIHZhbHVlOiB7fVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudENhcGFiaWxpdGllcztcbiIsImZ1bmN0aW9uIGhvb2tDYXBhYmlsaXRpZXMob2JqZWN0KSB7XG5cbiAgICB2YXIgaG9va3MgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2hvb2snLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihuYW1lLCByZXN0cmljdCkge1xuICAgICAgICAgICAgaG9va3NbbmFtZV0gPSByZXN0cmljdCA/IFtyZXN0cmljdF0gOiBbJ2FmdGVyJywgJ2JlZm9yZSddO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICd0cmlnZ2VySG9vaycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKG1vbWVudCwgbmFtZSwgYXJncykge1xuXG4gICAgICAgICAgICBpZiAobmFtZSBpbiBob29rcykge1xuICAgICAgICAgICAgICAgIGlmIChob29rc1tuYW1lXS5pbmRleE9mKG1vbWVudCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBbbW9tZW50ICsgJyAnICsgbmFtZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBob29rQ2FwYWJpbGl0aWVzO1xuIiwidmFyIGV2ZW50Q2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ldmVudC5qcycpO1xudmFyIGRlZkNhcGFiaWxpdGllcyA9IHJlcXVpcmUoJy4vZGVmLmpzJyk7XG52YXIgdGFnQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi90YWcuanMnKTtcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cbmZ1bmN0aW9uIG1vZGVsQ2FwYWJpbGl0aWVzIChNb2RlbCkge1xuXG4gICAgYWRkQ2FwYWJpbGl0aWVzLmNhbGwoTW9kZWwsIFtcbiAgICAgICAgZXZlbnRDYXBhYmlsaXRpZXMsXG4gICAgICAgIGRlZkNhcGFiaWxpdGllcyxcbiAgICAgICAgdGFnQ2FwYWJpbGl0aWVzXG4gICAgXSk7XG5cbiAgICBhZGRDYXBhYmlsaXRpZXMuY2FsbChNb2RlbC5wcm90b3R5cGUsIFtcbiAgICAgICAgZXZlbnRDYXBhYmlsaXRpZXMsXG4gICAgICAgIGRlZkNhcGFiaWxpdGllc1xuICAgIF0pO1xuXG5cbiAgICBNb2RlbC5ob29rKCdjcmVhdGUnKTtcblxuICAgIE1vZGVsLmRlZignY3JlYXRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKE1vZGVsLnByb3RvdHlwZSk7XG4gICAgICAgIE1vZGVsLmFwcGx5KGluc3RhbmNlLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIE1vZGVsO1xuXG59XG5cblxuZnVuY3Rpb24gYWRkQ2FwYWJpbGl0aWVzKGRlc3RpbmF0aW9ucykge1xuICAgIGZvciAodmFyIGkgaW4gZGVzdGluYXRpb25zKSB7XG4gICAgICAgIGRlc3RpbmF0aW9uc1tpXSh0aGlzKTtcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBtb2RlbENhcGFiaWxpdGllcztcbiIsImZ1bmN0aW9uIHRhZ0NhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICB2YXIgdGFncyA9IHt9O1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAndGFnJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKG5hbWUsIGVudGl0eSkge1xuXG4gICAgICAgICAgICB2YXIgdGFnID0gZmluZE9yQ3JlYXRlVGFnLmNhbGwodGhpcywgdGFncywgbmFtZSk7XG4gICAgICAgICAgICByZWZlcmVuY2VUYWdOYW1lKG5hbWUsIGVudGl0eSk7XG5cbiAgICAgICAgICAgIHRhZy5wdXNoKGVudGl0eSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICd1bnRhZycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChuYW1lLCBlbnRpdHkpIHtcblxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gdGFncykge1xuICAgICAgICAgICAgICAgIHRhZ3NbbmFtZV0uc3BsaWNlKHRhZ3NbbmFtZV0uaW5kZXhPZihlbnRpdHkpLCAxKTtcbiAgICAgICAgICAgICAgICBlbnRpdHkudGFnZ2VkSW4uc3BsaWNlKGVudGl0eS50YWdnZWRJbi5pbmRleE9mKG5hbWUpLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZpbmRPckNyZWF0ZVRhZyAodGFncywgbmFtZSkge1xuXG4gICAgaWYgKCEobmFtZSBpbiB0YWdzKSkge1xuICAgICAgICB0YWdzW25hbWVdID0gW107XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgICAgICB2YWx1ZTogdGFnc1tuYW1lXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFnc1tuYW1lXTtcblxufVxuXG5cbmZ1bmN0aW9uIHJlZmVyZW5jZVRhZ05hbWUgKG5hbWUsIGVudGl0eSkge1xuXG4gICAgaWYgKCEoJ3RhZ2dlZEluJyBpbiBlbnRpdHkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbnRpdHksICd0YWdnZWRJbicsIHtcbiAgICAgICAgICAgIHZhbHVlOiBbXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZW50aXR5LnRhZ2dlZEluLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICAgIGVudGl0eS50YWdnZWRJbi5wdXNoKG5hbWUpO1xuICAgIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gdGFnQ2FwYWJpbGl0aWVzO1xuIiwicmVxdWlyZSgnLi9jYXBhYmlsaXRpZXMvbW9kZWwuanMnKShVc2VyKTtcblxuZnVuY3Rpb24gVXNlcihwYXJhbXMpIHtcbiAgICB0aGlzLm5hbWUgPSBwYXJhbXMubmFtZTtcbn1cblxuVXNlci5wcm90b3R5cGUuaG9vaygnYml0Y2gnKTtcblVzZXIucHJvdG90eXBlLmRlZignYml0Y2gnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLCAnYml0Y2gnKTtcbn0pO1xuXG52YXIgcGFyYW1zID0ge1xuICAgIG5hbWU6ICdDeXJpbGxlJ1xufTtcblxudmFyIHYgPSBVc2VyLmNyZWF0ZShwYXJhbXMpO1xuXG52Lm9uKCdiZWZvcmUgYml0Y2gnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnYmVmb3JlIGJpdGNoJywgdGhpcyk7XG59KTtcblxudi5iaXRjaCgpO1xuXG5Vc2VyLnRhZygncm94eG9yJywgdik7XG5Vc2VyLnVudGFnKCdyb3h4b3InLCB2KTtcblxuY29uc29sZS5sb2coVXNlci5yb3h4b3IpOyJdfQ==
