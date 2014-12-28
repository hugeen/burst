var arrayProto = Array.prototype;

module.exports = function (object) {

    if ('length' in object && 'splice' in object) {
        return object;
    }

    object.length = 0;
    object.splice = arrayProto.splice;
    object.remove = remove;
    object.each = each;
    object.push = push;

    return object;
};


function each (iterator, value) {
    arrayProto.forEach.call(this, iterator, value);
}


function push () {
    arrayProto.push.apply(this, arrayProto.slice.call(arguments));
}


function remove (thing) {
    var index = this.indexOf(thing);

    if (index !== -1) {
        this.splice(index, 1);
    }
}
