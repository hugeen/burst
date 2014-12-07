var eventCapabilities = require('../core/event');
var easingFunctions = require('./easing');
var AnimationLoop = require('../draw/animation_loop');


function Tween (params) {
    eventCapabilities(this);

    this.easing = params.easing || 'linear';
    this.boundObject = params.bind || null;
    this.setupProperties(params.from, params.to);
    this.setupLoop(params.duration);
}


Tween.prototype.setupProperties = function (from, to) {
    this.props = [];

    for (var key in from) {
        this.props.push({
            key: key,
            diff: to[key] - from[key],
            value: from[key]
        });
    }
};


Tween.prototype.setupLoop = function (duration) {
    var self = this;
    this.duration = duration;
    this.progress = 0;

    this.animationLoop = new AnimationLoop(function() {
        if (this.lastTime >= self.duration) {
            this.stop();
        } else {
            self.progress = Math.min(1, easingFunctions[self.easing](this.lastTime / self.duration));
            self.update();
        }
    });
};


Tween.prototype.update = function () {
    for (var i = 0; i < this.props.length; i++) {
        var prop = this.props[i];
        prop.value = prop.diff * this.progress;

        if (this.boundObject) {
            this.boundObject[prop.key] = prop.value;
        }
    }
};


module.exports = Tween;