import {emit} from './event';


export function processQueue (items, processBy = 1) {
    emit(items, 'start');
    for (var i = 0; i < processBy; i++) {
        processNextQueueItem(items);
    }
};


function processNextQueueItem (items) {
    if (items.length) {
        emit(items, 'next');
        items.shift()(nextItemCaller(items));
    } else {
        emit(items, 'complete');
    }
}


function nextItemCaller (items) {
    return function () {
        processNextQueueItem(items);
    };
}
