var arrayProto = Array.prototype;


function DomQuery (arg) {
    arrayProto.push.apply(this, isElement(arg) ? [arg] : fetchElements(arg));
}


DomQuery.prototype.length = 0;


DomQuery.prototype.splice = arrayProto.splice;


DomQuery.prototype.on = function (name, fnc) {
    this.each(function (el) {
        el.addEventListener(name, fnc);
    });
};


DomQuery.prototype.removeListener = function (name, fnc) {
    this.each(function (el) {
        el.removeEventListener(name, fnc);
    });
};


DomQuery.prototype.each = function (iterator, value) {
    arrayProto.forEach.call(this, iterator, value);
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


function onDomReady (fnc) {
    return document.readyState === 'complete' ? fnc() : $(document).on('DOMContentLoaded', fnc);
}


module.exports = function $ (arg) {
    return typeof arg === 'function' ? domReady(arg) : new DomQuery(arg);
};
