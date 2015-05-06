var queueTracking = new WeakMap();


export function build () {
    var queue = [];
    setTracking(queue, 0);
    return queue;
};


export function append (queue, action) {
    queue.push(action);
};


export function process (queue) {
    if (!isCompleted(queue)) {
        var currentIndex = getTracking(queue);
        setTracking(queue, currentIndex + 1);
        queue[currentIndex](() => process(queue));
    }
};


function setTracking (queue, tracking) {
    queueTracking.set(queue, tracking);
};


function getTracking (queue) {
    return queueTracking.get(queue);
};


function getProgress (queue) {
    return getTracking(queue) / queue.length;
};


function isCompleted (queue) {
    return getTracking(queue) === queue.length;
};
