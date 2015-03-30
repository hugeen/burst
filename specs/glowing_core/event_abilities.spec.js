import assert from 'glowing_core/assert';
import eventAbilities from 'glowing_core/event_abilities';


var specs = [];
var mock;
var passed;



function reset () {
    mock = eventAbilities();
    passed = 0;
}


function increment () {
    passed += 1;
}



specs.push(function () {
    reset();

    mock.on('hello', function () {
        passed = true;
    });

    mock.emit('hello');

    return assert(passed, 'should register and trigger listener');
});


specs.push(function () {
    reset();

    mock.on('hello', increment);
    mock.on('hello', increment);
    mock.on('hello', increment);

    mock.emit('hello');

    return assert(passed === 3, 'should trigger multiple listeners');
});



specs.push(function () {
    reset();

    mock.on('hello', increment);
    mock.removeListener('hello', increment);

    mock.emit('hello');

    return assert(passed === 0, 'should remove a listener');
});



specs.push(function () {
    reset();

    var param1;
    var param2;
    mock.on('custom', function (p1, p2) {
        param1 = p1;
        param2 = p2;
    });

    mock.emit('custom', true, false);

    return assert(param1 && !param2, 'should forward parameters');
});


export default {name: 'Event abilities', specs};
