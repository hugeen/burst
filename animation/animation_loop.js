require('../dom/polyfills/animation')(window);


function AnimationLoop (callback, autostart) {
    this.callback = callback;

    if (autostart || true) {
        this.resume();
    }
}


AnimationLoop.prototype.stop = function () {
    this.running = false;
    cancelAnimationFrame(this.raf);
};


AnimationLoop.prototype.resume = function () {
    this.lastTime = 0;
    this.running = true;
    this.loop();
};


AnimationLoop.prototype.loop = function () {
    var self = this;

    this.raf = requestAnimationFrame(function (time) {
        if (self.running) {
            var deltaTime = Math.min(0.5, (time - self.lastTime) * 0.001);
            self.lastTime = time;
            self.callback(deltaTime);
            self.loop();
        }
    });
};


module.exports = AnimationLoop;