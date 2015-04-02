import assert from 'core/assert';
import {on, emit, removeListener, getListeners} from 'core/event';


var specs = [];


var mock;
var passed;

function reset () {
    mock = {};
    passed = 0;
}


function increment () {
    passed += 1;
}


specs.push(function () {
    reset();

    on(mock, 'event name', increment);
    emit(mock, 'event name');

    return assert(passed, 'should register and trigger listener');
});


specs.push(function () {
    reset();

    on(mock, 'event name', increment);
    var listeners = getListeners(mock, 'event name');

    return assert(listeners.length, 'should get listeners');
});


specs.push(function () {
    reset();

    on(mock, 'event name', increment);
    on(mock, 'event name', increment);
    on(mock, 'event name', increment);
    emit(mock, 'event name');

    return assert(passed === 3, 'should trigger multiple listeners');
});


specs.push(function () {
    reset();

    on(mock, 'event name', increment);
    removeListener(mock, 'event name', increment);
    emit(mock, 'event name');

    return assert(!passed, 'should remove a listener');
});


specs.push(function () {
    reset();

    on(mock, 'event name', increment);
    removeListener(mock, 'event name', function() {});
    var listeners = getListeners(mock, 'event name');

    return assert(listeners.length, 'should not remove listener');
});


specs.push(function () {
    reset();

    var param1;
    var param2;

    on(mock, 'custom', function (p1, p2) {
        param1 = p1;
        param2 = p2;
    });

    emit(mock, 'custom', true, false);

    return assert(param1 && !param2, 'should forward parameters');
});


specs.push(function () {
    reset();

    var array = [1, 2, 3];
    var count;

    on(array, 'custom', function () {
        this.push(4);
    });

    on(array, 'custom', function () {
        this.push(5);
    });

    emit(array, 'custom');

    return assert(array.length === 5, 'should work with array');
});


specs.push(function () {
    reset();

    on(increment, 'custom', function () {
        this();
    });

    emit(increment, 'custom');

    return assert(passed, 'should work with functions');
});


export default {name: 'Event', specs};
