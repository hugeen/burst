import assert from 'core/assert';
import {on} from 'core/event';
import {startQueue} from 'core/queue';


var specs = [];

var passed = 0;

function increment (next) {
    passed += 1;
    next();
}

function reset () {
    passed = 0;
}

specs.push(function (done) {
    reset();
    var queue = [increment, increment, increment];
    startQueue(queue);
    done(assert(queue, 'should start queue'));
});


specs.push(function (done) {
    reset();
    var queue = [increment, increment, increment];
    var completed = false;
    on(queue, 'complete', function () {
        completed = true;
    });
    startQueue(queue);
    done(assert(completed, 'should emit an event on complete'));
});


export default {name: 'Queue', specs};
