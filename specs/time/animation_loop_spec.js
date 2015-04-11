import assert from 'core/assert';
import {globalAnimationLoop, startAnimationLoop, stopAnimationLoop} from 'time/animation_loop';
import {on} from 'core/event';
import {failTimeout} from 'specs/specs_helper';


var specs = [];


specs.push(function (done) {
    var message = 'should start the loop';
    var timeout = failTimeout(done, 100, message);

    var object = {};
    on(object, 'enter frame', function (deltaTime) {
        stopAnimationLoop(object);
        clearTimeout(timeout);
        done(assert(true, message));
    });

    startAnimationLoop(object);
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

    startAnimationLoop(object);
    stopAnimationLoop(object);
});


export default {name: 'Animation loop', specs};
