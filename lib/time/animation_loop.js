import { on, emit, removeListener } from '../core/event';


var loopableMap = new WeakMap();
var running = false;
var deltaTime = 0;
var lastTime = 0;


export var globalAnimationLoop = {};


Object.defineProperties(globalAnimationLoop, {
    running: 	{get: () => running},
    deltaTime: 	{get: () => deltaTime},
    lastTime: 	{get: () => lastTime}
});


export function enterFrame (elapsedTime) {
    if (running) {
        deltaTime = !lastTime ? 0 : elapsedTime - lastTime;
        lastTime = elapsedTime;
        emit(globalAnimationLoop, 'enter frame', deltaTime);
        requestAnimationFrame(enterFrame);
    }
};


export function startGlobalAnimationLoop () {
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


export function startAnimationLoop (object) {
    startGlobalAnimationLoop();
    on(globalAnimationLoop, 'enter frame', getAnimationLoopListener(object));
};


export function stopAnimationLoop (object) {
    removeListener(globalAnimationLoop, 'enter frame', getAnimationLoopListener(object));
};
