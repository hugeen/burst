import assert from 'core/assert';
import animationLoop from 'time/animation_loop';


var specs = [];


specs.push(function (done) {
    var handler = animationLoop(function () {});
    var started = handler.animationFrame;
    handler.stop();
    done(assert(started, 'should start the loop'));
});


specs.push(function (done) {
    var handler = animationLoop(function () {});
    handler.stop();
    done(assert(!handler.animationFrame, 'should stop the loop'));
});


specs.push(function (done) {
    var passed = false;
    var handler = animationLoop(function () {
        passed = true;
    });
    handler.enterFrame(0);
    handler.stop();

    done(assert(passed, 'should execute the callback'));
});


specs.push(function (done) {
    var handler = animationLoop(function() {});
    handler.deltaTime = 0;
    handler.lastTime = 10;
    handler.enterFrame(15);
    handler.stop();

    done(assert(handler.deltaTime === 5, 'should compute delta time'));
});


export default {name: 'Animation loop', specs};
