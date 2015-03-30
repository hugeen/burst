import SpecSet from 'glowing_specs/spec_set';
import assert from 'glowing_specs/assert';
import eventAbilities from 'glowing_core/event_abilities';



var specs = new SpecSet('Event abilities');
var mock;
var passed;



function resetMock () {
    mock = eventAbilities();
    passed = 0;
}


function increment () {
    passed += 1;
}



specs.add('should register and trigger listener', function (name) {
    resetMock();

    mock.on('hello', function () {
        passed = true;
    });

    mock.emit('hello');

    return assert(passed, name);
});


specs.add('should trigger multiple listeners', function (name) {
    resetMock();

    mock.on('hello', increment);
    mock.on('hello', increment);
    mock.on('hello', increment);

    mock.emit('hello');

    return assert(passed === 3, name);
});



specs.add('should remove a listener', function (name) {
    resetMock();

    mock.on('hello', increment);
    mock.removeListener('hello', increment);

    mock.emit('hello');

    return assert(passed === 0, name);
});



specs.add('should forward parameters', function (name) {
    resetMock();
    var param1;
    var param2;
    mock.on('custom', function (p1, p2) {
        param1 = p1;
        param2 = p2;
    });

    mock.emit('custom', true, false);

    return assert(param1 && !param2, name);
});


export default specs;
