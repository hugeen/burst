import assert from 'glowing_core/assert';
import {on, emit, removeListener} from 'glowing_core/event_emitter';


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

    var param1;
    var param2;

    on(mock, 'custom', function (p1, p2) {
        param1 = p1;
        param2 = p2;
    });

    emit(mock, 'custom', true, false);

    return assert(param1 && !param2, 'should forward parameters');
});


export default {name: 'Event emitter', specs};
