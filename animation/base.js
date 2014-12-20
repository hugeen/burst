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
    cancelAnimationFrame(this.id);
};


AnimationLoop.prototype.resume = function () {
    this.lastTime = 0;
    this.running = true;
    enterFrame(this);
};


function enterFrame(handler) {
    handler.id = requestAnimationFrame(function (time) {
        if (handler.running) {
            var deltaTime = Math.min(time - handler.lastTime);
            handler.lastTime = time;

            handler.callback.call(handler.bind, handler, deltaTime);
            enterFrame(handler);
        } else {
            handler.stop();
        }
    });
}
