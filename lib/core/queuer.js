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


export function setTracking (queue, tracking) {
    queueTracking.set(queue, tracking);
};


export function getTracking (queue) {
    return queueTracking.get(queue);
};


export function getProgress (queue) {
    return getTracking(queue) / queue.length;
};


export function isCompleted (queue) {
    return getTracking(queue) === queue.length;
};
