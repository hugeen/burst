import SpecSet from 'glowing_specs/spec_set';
import assert from 'glowing_specs/assert';
import eventAbilities from 'glowing_core/event_abilities';


var specs = new SpecSet('Event abilities');
var mock;
var passed;


function resetMock () {
    mock = eventAbilities();
    passed = false;
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

    passed = 0;

    mock.on('hello', increment);
    mock.on('hello', increment);
    mock.on('hello', increment);

    mock.emit('hello');

    return assert(passed === 3, name);
});



export default specs;
