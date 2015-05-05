var queueMap = new WeakMap();


export function buildQueue () {
    var queue = [];

    queueMap.set(queue, buildQueueData());

    return queue;
};


export function appendQueue (queue, action) {
    getQueueData(queue).total += 1;
    queue.push(action);
};


export function processQueue (queue) {
    if (queue.length) {
        queue.shift()(function () {
            getQueueData(queue).processed += 1;
            processQueue(queue);
        });
    }
};


function getQueueData (queue) {
    return queueMap.get(queue);
};

function buildQueueData () {
    var data = {};

    data.processed = 0;
    data.total = 0;
    data.progress = () => data.processed / data.total;

    return data;
};
