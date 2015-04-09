import assert from 'core/assert';


var specs = [];


specs.push(function (done) {
    var assertion = assert(true, 'should pass');

    done(assert(assertion.passed, 'should pass'));
});


specs.push(function (done) {
    var assertion = assert(false, 'should fail');

    done(assert(!assertion.passed, 'should fail'));
});


specs.push(function (done) {
    var assertion = assert(true, 'should pass');

    done(assert(assertion.infos instanceof Error, 'should return an object Error'));
});


export default {name: 'Assert', specs};
