var defCapabilities = require('./def.js');


function hook (name, restrict) {
    this.hooks[name] = restrict ? [restrict] : ['after', 'before'];
}


function before (methodName, fnc) {
    this.on('before' + methodName, fnc);
}


function after (methodName, fnc) {
    this.on('after' + methodName, fnc);
}


function triggerHook (moment, name, args) {
    if (name in hooks) {
        if (hooks[name].indexOf(moment) !== -1) {
            this.emit.apply(this, [moment + ' ' + name].concat(args));
        }
    }
}


function logHook (name) {
    this.hook(name);
    var moments = this.hooks[name];
    for (var i = 0; i < moments.length; i++) {
        this.logEvent(moments[i] + ' ' + name);
    }
}


function prepareHook (methodName, moment) {
    if (!(methodName in this.hooks)) {
        this.def(methodName, this[methodName]);
        this.hook(methodName);
    }
}


module.exports = function(object) {

    if ('hook' in object) {
        return object;
    }

    defCapabilities(object);


    var properties = {
        hooks: {},
        hook: hook,
        triggerHook: triggerHook,
        logHook: logHook,
        prepareHook: prepareHook
    };

    for (var name in methods) {
        Object.defineProperty(object, name, {
            value: properties[name]
        });
    }


    return object;

};
