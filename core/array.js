var arrayProto = Array.prototype;

module.exports = function (object) {

    object.length = 0;
    object.splice = arrayProto.splice;
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