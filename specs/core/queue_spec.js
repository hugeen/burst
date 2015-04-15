import assert from 'core/assert';
import {processQueue} from 'core/queue';


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
    processQueue(queue);
    done(assert(queue, 'should start queue'));
});


export default {name: 'Queue', specs};
