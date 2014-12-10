var eventCapabilities = require('../core/event');
var easingFunctions = require('./easing');
var AnimationLoop = require('../draw/animation_loop');


function Tween (params) {
    eventCapabilities(this);

    this.easing = params.easing || 'linear';

    this.setupProperties(params.from, params.to);
    this.setupLoop(params.duration);
}


Tween.prototype.setupProperties = function (from, to) {
    this.raw = from.slice(0);
    this.props = setupArray([], from, to);
};


function setupArray (array, from, to) {
    for (var i = 0; i < from.length; i++) {
        var prop;

        if (from[i] instanceof Array) {
            prop = setupArray([], from[i], to[i]);
        } else {
            prop = {
                diff: to[i] - from[i],
                value: from[i]
            };
        }
        array.push(prop);
    }

    return array;
}


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
    this.emit('update', handleProperties(this.raw, this.props, this.progress));
};


function handleProperties (raw, props, progress) {
    for (var i = 0; i < props.length; i++) {
        if (props[i] instanceof Array) {
            handleProperties(raw[i], props[i], progress);
        } else {
            raw[i] = props[i].value = props[i].diff * progress;
        }
    }
    return raw;
}


module.exports = Tween;