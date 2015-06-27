import { on, emit, removeListener } from '../core/event';


var loopableMap = new WeakMap();
var running = false;
var deltaTime = 0;
var lastTime = 0;


export var animationLoop = {};


Object.defineProperties(animationLoop, {
    running: 	{get: () => running},
    deltaTime: 	{get: () => deltaTime},
    lastTime: 	{get: () => lastTime}
});


export function enterFrame (elapsedTime) {
    if (running) {
        deltaTime = !lastTime ? 0 : elapsedTime - lastTime;
        lastTime = elapsedTime;
        emit(animationLoop, 'enter frame', deltaTime);
        requestAnimationFrame(enterFrame);
    }
};


export function initAnimationLoop () {
    if (!running) {
        running = true;
        requestAnimationFrame(enterFrame);
    }
};


export function getAnimationLoopListener (object) {
    if (!loopableMap.has(object)) {
        loopableMap.set(object, function(deltaTime) {
            emit(object, 'enter frame', deltaTime);
        });
    }

    return loopableMap.get(object);
};


export function enableAnimationLoop (object) {
    initAnimationLoop();
    on(animationLoop, 'enter frame', getAnimationLoopListener(object));
};


export function disableAnimationLoop (object) {
    removeListener(animationLoop, 'enter frame', getAnimationLoopListener(object));
};
