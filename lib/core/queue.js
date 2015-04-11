import {emit} from './event';


export function startQueue (items, processBy = 1) {
    emit(items, 'start');
    for (var i = 0; i < processBy; i++) {
        callNextItem(items);
    }
};


export function callNextItem (items) {
    if (items.length) {
        emit(items, 'next');
        items.shift()(nextItemCaller(items));
    } else {
        emit(items, 'complete');
    }
};


export function nextItemCaller (items) {
    return function () {
        callNextItem(items);
    };
};
