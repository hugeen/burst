var slice = Array.prototype.slice;
var animLoop = require('../../animation/loop');


module.exports = function (Canvas) {

    Canvas.prototype.animate = animate;

    return Canvas;
};


function animate (callback) {
    animLoop(function () {
        this.clear();
        callback.call(this, slice.call(arguments));
    }, this);

    return this;
}