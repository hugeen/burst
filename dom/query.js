var arrayProto = Array.prototype;


function $ (arg) {

    var value;

    if (typeof arg === 'function') {
        if (document.readyState === 'complete') {
            value = arg();
        } else {
            value = $(document).on('DOMContentLoaded', arg);
        }
    } else {
        value = new Query(arg);
    }

    return value;
}


function Query (arg) {

    var value;

    if (arg && arg.nodeType) {
        value = [arg];
    } else {
        value = '' + arg === arg ? document.querySelectorAll(arg) : undefined;
    }

    arrayProto.push.apply(this, value);
}


Query.prototype.length = 0;


Query.prototype.splice = arrayProto.splice;


Query.prototype.on = function (name, fnc) {
    return this.each(function (el) {
        el.addEventListener(name, fnc);
    });
};


Query.prototype.removeListener = function (name, fnc) {
    return this.each(function (el) {
        el.removeEventListener(name, fnc);
    });
};


Query.prototype.each = function (iterator, value) {
    arrayProto.forEach.call(this, iterator, value);
    return this;
};


module.exports = $;
