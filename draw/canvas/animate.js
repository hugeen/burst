module.exports = function (Canvas) {

    Canvas.prototype.animate = animate;

    return Canvas;
};


var AnimationLoop = require('../animation_loop');

function animate (fnc) {

    var self = this;

    this.animationLoop = new AnimationLoop(function (deltaTime) {
        self.clear();
        fnc.call(self, deltaTime);
    });

    return this;
}
