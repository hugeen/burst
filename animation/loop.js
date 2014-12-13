require('../dom/polyfills/animation')(window);


module.exports = function (callback, bind) {
    return new AnimationLoop(callback, bind);
};


function AnimationLoop (callback, bind) {
    this.callback = callback;
    this.bind = bind || this;
    this.resume();
}


AnimationLoop.prototype.stop = function () {
    this.running = false;
    cancelAnimationFrame(this.raf);
};


AnimationLoop.prototype.resume = function () {
    this.lastTime = 0;
    this.running = true;
    enterFrame(this);
};


function enterFrame(handler) {
    handler.raf = requestAnimationFrame(function (time) {
        if (handler.running) {
            var deltaTime = Math.min(0.5, (time - handler.lastTime) * 0.001);
            handler.lastTime = time;

            handler.callback.call(handler.bind, handler, deltaTime);
            enterFrame(handler);
        }
    });
}
