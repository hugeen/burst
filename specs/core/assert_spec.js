import assert from 'core/assert';


var specs = [];


specs.push(function () {
    var assertion = assert(true, 'should pass');

    return assert(assertion.passed, 'should pass');
});


specs.push(function () {
    var assertion = assert(false, 'should fail');

    return assert(!assertion.passed, 'should fail');
});


specs.push(function () {
    var assertion = assert(true, 'should pass');

    return assert(assertion.infos instanceof Error, 'should return an object Error');
});


export default {name: 'Assert', specs};
