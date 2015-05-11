var queueTracking = new WeakMap();


export function getQueueTracking (queue) {
    if (!queueTracking.has(queue)) {
        queueTracking.set(queue, 0);
    }
    return queueTracking.get(queue);
};


export function setQueueTracking (queue, tracking) {
    queueTracking.set(queue, tracking);
};


export function processQueue (queue) {
    if (!isCompletedQueue(queue)) {
        processQueueItem(queue, getQueueTracking(queue));
    }
};


export function processQueueItem (queue, index) {
    setQueueTracking(queue, index + 1);
    queue[index](() => processQueue(queue));
};


export function getQueueProgress (queue) {
    return getQueueTracking(queue) / queue.length;
};


export function isCompletedQueue (queue) {
    return getTracking(queue) === queue.length;
};
