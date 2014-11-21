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
