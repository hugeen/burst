var arrayProto = Array.prototype;


function Query (arg) {
    arrayProto.push.apply(this, isElement(arg) ? [arg] : fetchElements(arg));
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


function isElement (arg) {
    return arg && arg.nodeType;
}


function isSelector (arg) {
    return '' + arg === arg;
}


function fetchElements (selector) {
    return isSelector(selector) ? document.querySelectorAll(selector) : undefined;
}


function domReady (callback) {
    return document.readyState === 'complete' ? callback() : $(document).on('DOMContentLoaded', callback);
}


module.exports = function $ (arg) {
    return typeof arg === 'function' ? domReady(arg) : new Query(arg);
};
