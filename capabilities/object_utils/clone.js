var slice = Array.prototype.slice;

function clone() {

    var newObject = {};
    for(var key in this) {
        newObject[key] = this[key]
    }

    return newObject;
}

module.exports = function(object) {

    Object.defineProperty(object, "clone", {
        enumerable: false,
        writable: true,
        value: clone
    });

    return object;
};
