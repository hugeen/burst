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
    this.running = true;
    this.loop();
};


AnimationLoop.prototype.loop = function () {
    var self = this;

    this.raf = requestAnimationFrame(function (time) {
        if (self.running) {
            self.callback(time);
            self.loop();
        }
    });
};


module.exports = AnimationLoop;