export function processQueue (items, processBy = 1) {
    for (let i = 0; i < processBy; i++) {
        processNextQueueItem(items);
    }
};


function processNextQueueItem (items) {
    if (items.length) {
        items.shift()(nextItemCaller(items));
    }
}


function nextItemCaller (items) {
    return function () {
        processNextQueueItem(items);
    };
}
