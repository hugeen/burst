var slice = Array.prototype.slice;
var arrayCapabilities = require('./array');


module.exports = function (object) {
    object.invoke = invoke;
};


function invoke () {
    var args = slice.call(arguments);
    var methodName = args.shift();

    this.each(function (item) {
        if (methodName in item) {
            item[methodName].apply(item, args);
        }
    });
}
