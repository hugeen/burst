import {describe, it, beforeEach} from 'test/describe';
import should from 'test/should';

import {processQueue} from 'core/queue';


describe('Queue', function () {

    var queue;
    var passed;


    beforeEach(function () {
        queue = [];
        passed = 0;
    });


    it('should process queue', function () {
        queue.push(function (done) {
            passed += 1;
            done();
        });
        processQueue(queue);

        should(passed);
    });

});
