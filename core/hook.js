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


    Object.defineProperty(object, 'logHook', {
        value: function(name) {

            this.hook(name);
            var moments = hooks[name];
            for (var i = 0; i < moments.length; i ++) {
                this.logEvent(moments[i] + ' ' + name);
            }

        }
    });

    return object;

}


module.exports = hookCapabilities;
