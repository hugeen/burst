import assert from 'core/assert';
import {animationLoop, enableAnimationLoop, disableAnimationLoop} from 'time/animation_loop';
import {on} from 'core/event';
import {failTimeout} from 'specs/specs_helper';


var specs = [];


specs.push(function (done) {
    var message = 'should start the loop';
    var timeout = failTimeout(done, 100, message);

    var object = {};
    on(object, 'enter frame', function (deltaTime) {
        disableAnimationLoop(object);
        clearTimeout(timeout);
        done(assert(true, message));
    });

    enableAnimationLoop(object);
});


specs.push(function (done) {
    var message = 'should stop the loop';
    var timeout = setTimeout(function () {
        done(assert(true, message));
    }, 100);

    var object = {};
    on(object, 'enter frame', function (deltaTime) {
        clearTimeout(timeout);
        done(assert(false, message));
    });

    enableAnimationLoop(object);
    disableAnimationLoop(object);
});


export default {name: 'Animation loop', specs};
