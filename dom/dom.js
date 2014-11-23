var arrayProto = Array.prototype;
var splice = arrayProto.splice;
var push = arrayProto.push;
var forEach = arrayProto.forEach;


function $ (arg) {

    var value;

    if (typeof arg === 'function') {
        if (document.readyState === 'complete') {
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


(function (proto) {

    proto.length = 0;

    proto.splice = splice;


    proto.on = function (name, fnc) {
        return this.each(function (el) {
            el.addEventListener(name, fnc);
        });
    };


    proto.removeListener = function (name, fnc) {
        return this.each(function (el) {
            el.removeEventListener(name, fnc);
        });
    };


    proto.each = function (iterator, value) {
        forEach.call(this, iterator, value);
        return this;
    };

})(QuerySelector.prototype);


module.exports = $;
