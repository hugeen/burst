var defCapabilities = require('./def.js');
var eventCapabilities = require('./event.js');


module.exports = function(object) {

    if ('hook' in object) {
        return object;
    }

    defCapabilities(object);
    eventCapabilities(object);

    var properties = {
        hooks: {},
        hook: hook,
        before: before,
        after: after,
        triggerHook: triggerHook,
        logHook: logHook
    };

    for (var name in properties) {
        Object.defineProperty(object, name, {
            value: properties[name]
        });
    }


    return object;

};


function hook (name, restrict) {
    this.hooks[name] = restrict ? [restrict] : ['after', 'before'];
}


function before (methodName, fnc) {
    prepareHook.call(this, methodName, 'before');
    this.on('before ' + methodName, fnc);
}


function after (methodName, fnc) {
    prepareHook.call(this, methodName, 'after');
    this.on('after ' + methodName, fnc);
}


function triggerHook (moment, name, args) {
    if (name in this.hooks) {
        if (this.hooks[name].indexOf(moment) !== -1) {
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
