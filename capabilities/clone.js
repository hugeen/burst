function cloneCapabilities (object) {

    Object.defineProperty(object, 'clone', {
        value: clone
    });

    return object;
}


function clone () {

    var newObject = {};
    for (var key in this) {
        newObject[key] = this[key];
    }

    return newObject;
}


module.exports = cloneCapabilities;