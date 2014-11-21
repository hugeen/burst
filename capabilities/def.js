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

                triggerHook.call(this, 'before', name, slice.call(arguments));
                var value = args.fnc.apply(this, arguments);
                triggerHook.call(this, 'after', name, slice.call(arguments));

                return value;

            };


            Object.defineProperty(this, name, settings);

            return this;

        }
    });


    return object;

}


function triggerHook(moment, name, args) {

    var hooks = object.hooks[name] || [];

    if (hooks.indexOf(moment) !== -1) {
        this.emit.apply(this, [moment + name].concat(args));
    }

}


function formatArguments () {

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


module.exports = defCapabilities;
