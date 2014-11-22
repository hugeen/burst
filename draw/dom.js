var splice = Array.prototype.splice;
var push = Array.prototype.push;
var forEach = Array.prototype.forEach;


function $ (arg) {
    var value;

    if (/^f/.test(typeof arg)) {
        if (/c/.test(document.readyState)) {
            value = arg();
        } else {
            value = $(document).on('DOMContentLoaded', arg);
        }
    } else {
        value = new QuerySelector(arg);
    }

    return value;
}


function QuerySelector (arg) {
    var value;
    if (arg && arg.nodeType) {
        value = [arg];
    } else {
        value = '' + arg === arg ? document.querySelectorAll(arg) : undefined;
    }

    push.apply(this, value);
}


QuerySelector.prototype.length = 0;


QuerySelector.prototype.splice = splice;


QuerySelector.prototype.on = function (name, fnc) {
    return this.each(function (el) {
        el.addEventListener(name, fnc);
    });
};


QuerySelector.prototype.removeListener = function (name, fnc) {
    return this.each(function (el) {
        el.removeEventListener(name, fnc);
    });
};


QuerySelector.prototype.each = function (iterator, value) {
    forEach.call(this, iterator, value);
    return this;
};


module.exports = $;
