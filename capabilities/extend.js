var slice = Array.prototype.slice;

function extend() {

    var args = slice.call(arguments);

    for (var i = 0; i < args.length; i++) {

        var arg = args[i];
        for (var key in arg) {
            this[key] = arg[key];
        }

    }

    return this;
}


module.exports = function(object) {

    Object.defineProperty(object, 'extend', {
        value: extend
    });

    return object;
};
