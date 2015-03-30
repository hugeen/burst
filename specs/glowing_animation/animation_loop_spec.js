import assert from 'glowing_core/assert';
import AnimationLoop from 'glowing_animation/animation_loop';


var specs = [];


var animationLoop;

function reset() {
    if (animationLoop) {
        animationLoop.stop();
    }
    animationLoop = new AnimationLoop();

}


specs.push(function () {
    reset();
    animationLoop.resume();
    var running = animationLoop.running;
    animationLoop.stop();

    return assert(running, 'should start the loop');
});


specs.push(function () {
    reset();
    animationLoop.resume();
    animationLoop.stop();
    var running = animationLoop.running;

    return assert(!running, 'should stop the loop');
});


specs.push(function () {
    var passed = false;
    animationLoop = new AnimationLoop(function () {
        passed = true;
    });
    animationLoop.callback();

    return assert(passed, 'should execute the callback');
});


specs.push(function () {
    reset();
    animationLoop.running = true;
    animationLoop.lastTime = 10;
    animationLoop.enterFrame(15);
    var deltaTime = animationLoop.deltaTime;
    animationLoop.stop();

    return assert(deltaTime === 5, 'should compute delta time');
});


export default {name: 'Animation loop', specs};
