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
var slice = Array.prototype.slice;


var requiredCapabilities = [
    require('./event.js'),
    require('./def.js'),
    require('./tag.js')
];


function modelCapabilities(Model) {

    addCapabilities.call(Model, requiredCapabilities);


    Model.hook('create');

    Model.def('create', function() {
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

User.on('before create', function(params) {
    params.name = 'Pierre';
});

var params = {
    name: 'Cyrille'
};

var u = User.create(params);

console.log(u);

},{"./capabilities/model.js":"/Users/cyrillebogaert/exp/full_capabilities/capabilities/model.js"}]},{},["/Users/cyrillebogaert/exp/full_capabilities/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzIvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvZGVmLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvZXZlbnQuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy9ob29rLmpzIiwiL1VzZXJzL2N5cmlsbGVib2dhZXJ0L2V4cC9mdWxsX2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMvbW9kZWwuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy90YWcuanMiLCIvVXNlcnMvY3lyaWxsZWJvZ2FlcnQvZXhwL2Z1bGxfY2FwYWJpbGl0aWVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBob29rQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi9ob29rLmpzJyk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxudmFyIGN1c3RvbWl6YWJsZUF0dHJzID0gWyd3cml0YWJsZScsICdjb25maWd1cmFibGUnLCAnZW51bWVyYWJsZSddO1xuXG5cbmZ1bmN0aW9uIGRlZkNhcGFiaWxpdGllcyAob2JqZWN0KSB7XG5cbiAgICBob29rQ2FwYWJpbGl0aWVzKG9iamVjdCk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdkZWYnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBhcmdzID0gZm9ybWF0QXJndW1lbnRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBhcmdzLnNldHRpbmdzO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBhcmdzLm5hbWU7XG5cblxuICAgICAgICAgICAgc2V0dGluZ3MudmFsdWUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIG9iamVjdC50cmlnZ2VySG9vaygnYmVmb3JlJywgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzLmZuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIG9iamVjdC50cmlnZ2VySG9vaygnYWZ0ZXInLCBuYW1lLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCBzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3VtZW50cyAoKSB7XG5cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmdzWzJdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZXR0aW5ncyA9IGFyZ3NbMV0uc3BsaXQoJyAnKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3VzdG9taXphYmxlQXR0cnMuaW5kZXhPZihzZXR0aW5nc1tpXSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Nbc2V0dGluZ3NbaV1dID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYXJnc1swXSxcbiAgICAgICAgZm5jOiBhcmdzWzJdIHx8IGFyZ3NbMV0sXG4gICAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xuICAgIH07XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZkNhcGFiaWxpdGllcztcbiIsInZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gZXZlbnRDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBvYmplY3Qub24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG5cbiAgICB2YXIgbGlzdGVuZXJzID0ge307XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdsaXN0ZW5lcnMnLCB7XG4gICAgICAgIHZhbHVlOiBsaXN0ZW5lcnNcbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ29uJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl0gPSBsaXN0ZW5lcnNbaWRlbnRpZmllcl0gfHwgW107XG4gICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl0ucHVzaChmbmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAncmVtb3ZlTGlzdGVuZXInLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpZGVudGlmaWVyLCBmbmMpIHtcbiAgICAgICAgICAgIGlmIChpZGVudGlmaWVyIGluIGxpc3RlbmVycyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1tpZGVudGlmaWVyXS5zcGxpY2UobGlzdGVuZXJzW2lkZW50aWZpZXJdLmluZGV4T2YoZm5jKSwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdlbWl0Jywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaWRlbnRpZmllciwgZm5jKSB7XG4gICAgICAgICAgICBpZiAoaWRlbnRpZmllciBpbiBsaXN0ZW5lcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVyc1tpZGVudGlmaWVyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnNbaWRlbnRpZmllcl1baV0uYXBwbHkob2JqZWN0LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIG9iamVjdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZW50Q2FwYWJpbGl0aWVzO1xuIiwiZnVuY3Rpb24gaG9va0NhcGFiaWxpdGllcyhvYmplY3QpIHtcblxuICAgIHZhciBob29rcyA9IHt9O1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnaG9vaycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKG5hbWUsIHJlc3RyaWN0KSB7XG4gICAgICAgICAgICBob29rc1tuYW1lXSA9IHJlc3RyaWN0ID8gW3Jlc3RyaWN0XSA6IFsnYWZ0ZXInLCAnYmVmb3JlJ107XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3RyaWdnZXJIb29rJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obW9tZW50LCBuYW1lLCBhcmdzKSB7XG5cbiAgICAgICAgICAgIGlmIChuYW1lIGluIGhvb2tzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhvb2tzW25hbWVdLmluZGV4T2YobW9tZW50KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0LmFwcGx5KHRoaXMsIFttb21lbnQgKyAnICcgKyBuYW1lXS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGhvb2tDYXBhYmlsaXRpZXM7XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cblxudmFyIHJlcXVpcmVkQ2FwYWJpbGl0aWVzID0gW1xuICAgIHJlcXVpcmUoJy4vZXZlbnQuanMnKSxcbiAgICByZXF1aXJlKCcuL2RlZi5qcycpLFxuICAgIHJlcXVpcmUoJy4vdGFnLmpzJylcbl07XG5cblxuZnVuY3Rpb24gbW9kZWxDYXBhYmlsaXRpZXMoTW9kZWwpIHtcblxuICAgIGFkZENhcGFiaWxpdGllcy5jYWxsKE1vZGVsLCByZXF1aXJlZENhcGFiaWxpdGllcyk7XG5cblxuICAgIE1vZGVsLmhvb2soJ2NyZWF0ZScpO1xuXG4gICAgTW9kZWwuZGVmKCdjcmVhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShNb2RlbC5wcm90b3R5cGUpO1xuICAgICAgICBNb2RlbC5hcHBseShpbnN0YW5jZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBNb2RlbDtcblxufVxuXG5cbmZ1bmN0aW9uIGFkZENhcGFiaWxpdGllcyhkZXN0aW5hdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpIGluIGRlc3RpbmF0aW9ucykge1xuICAgICAgICBkZXN0aW5hdGlvbnNbaV0odGhpcyk7XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gbW9kZWxDYXBhYmlsaXRpZXM7XG4iLCJmdW5jdGlvbiB0YWdDYXBhYmlsaXRpZXMgKG9iamVjdCkge1xuXG4gICAgdmFyIHRhZ3MgPSB7fTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3RhZycsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChuYW1lLCBlbnRpdHkpIHtcblxuICAgICAgICAgICAgdmFyIHRhZyA9IGZpbmRPckNyZWF0ZVRhZyh0YWdzKTtcbiAgICAgICAgICAgIHJlZmVyZW5jZVRhZ05hbWUobmFtZSwgZW50aXR5KTtcblxuICAgICAgICAgICAgdGFnLnB1c2goZW50aXR5KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3VudGFnJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKG5hbWUsIGVudGl0eSkge1xuXG4gICAgICAgICAgICBpZiAobmFtZSBpbiB0YWdzKSB7XG4gICAgICAgICAgICAgICAgdGFnc1tuYW1lXS5zcGxpY2UodGFnc1tuYW1lXS5pbmRleE9mKGVudGl0eSksIDEpO1xuICAgICAgICAgICAgICAgIGVudGl0eS50YWdnZWRJbi5zcGxpY2UoZW50aXR5LnRhZ2dlZEluLmluZGV4T2YobmFtZSksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gb2JqZWN0O1xuXG59XG5cblxuZnVuY3Rpb24gY3JlYXRlVGFnKHRhZ3MpIHtcblxuICAgIGlmIChuYW1lIGluIHRhZ3MpIHtcbiAgICAgICAgdGFnc1tuYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiB0YWdzW25hbWVdO1xuXG59XG5cblxuZnVuY3Rpb24gcmVmZXJlbmNlVGFnTmFtZShuYW1lLCBlbnRpdHkpIHtcblxuICAgIGlmICghKCd0YWdnZWRJbicgaW4gZW50aXR5KSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW50aXR5LCAndGFnZ2VkSW4nLCB7XG4gICAgICAgICAgICB2YWx1ZTogW11cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eS50YWdnZWRJbi5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgICBlbnRpdHkudGFnZ2VkSW4ucHVzaChuYW1lKTtcbiAgICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhZ0NhcGFiaWxpdGllcztcbiIsInJlcXVpcmUoJy4vY2FwYWJpbGl0aWVzL21vZGVsLmpzJykoVXNlcik7XG5cbmZ1bmN0aW9uIFVzZXIocGFyYW1zKSB7XG4gICAgdGhpcy5uYW1lID0gcGFyYW1zLm5hbWU7XG59XG5cblVzZXIub24oJ2JlZm9yZSBjcmVhdGUnLCBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBwYXJhbXMubmFtZSA9ICdQaWVycmUnO1xufSk7XG5cbnZhciBwYXJhbXMgPSB7XG4gICAgbmFtZTogJ0N5cmlsbGUnXG59O1xuXG52YXIgdSA9IFVzZXIuY3JlYXRlKHBhcmFtcyk7XG5cbmNvbnNvbGUubG9nKHUpO1xuIl19
