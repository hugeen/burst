import assert from 'glowing_core/assert';
import animationLoop from 'glowing_time/animation_loop';


var specs = [];


specs.push(function () {
    var handler = animationLoop(function () {});
    var started = handler.animationFrame;
    handler.stop();
    return assert(started, 'should start the loop');
});


specs.push(function () {
    var handler = animationLoop(function () {});
    handler.stop();
    return assert(!handler.animationFrame, 'should stop the loop');
});


specs.push(function () {
    var passed = false;
    var handler = animationLoop(function () {
        passed = true;
    });
    handler.enterFrame(0);
    handler.stop();

    return assert(passed, 'should execute the callback');
});


specs.push(function () {
    var handler = animationLoop(function() {});
    handler.deltaTime = 0;
    handler.lastTime = 10;
    handler.enterFrame(15);
    handler.stop();

    return assert(handler.deltaTime === 5, 'should compute delta time');
});


export default {name: 'Animation loop', specs};
