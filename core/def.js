var slice = Array.prototype.slice;

var customizableAttrs = ['writable', 'configurable', 'enumerable'];


module.exports = function (object) {

    if ('def' in object) {
        return object;
    }


    var properties = {
        methods: {},
        def: def,
        silentCall: silentCall
    };

    for (var name in properties) {
        Object.defineProperty(object, name, {
            value: properties[name]
        });
    }


    return object;

};


function def () {

    var args = formatArguments.apply(this, arguments);
    var settings = args.settings;
    var name = args.name;
    console.log('def', args);

    settings.value = function() {

        this.triggerHook('before', name, slice.call(arguments));
        var value = args.fnc.apply(this, arguments);
        this.triggerHook('after', name, slice.call(arguments));

        return value;

    };


    Object.defineProperty(this, name, settings);
    this.methods[name] = args.fnc;


    return this;
}


function silentCall () {
    var args = slice.call(arguments);
    var name = args.shift();

    this.methods[name].apply(this, args);
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
