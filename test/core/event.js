import {
    on, emit, removeListener, getListeners,
    globalOn, globalEmit, globalRemoveListener, globalListeners
} from '../../lib/core/event';

import assert from 'assert';

describe('Event', function () {
    var mock;
    var passed;


    function increment () {
        passed += 1;
    }


    beforeEach(function () {
        mock = {};
        passed = 0;
    });


    it('should register and trigger listener', function () {
        on(mock, 'event name', increment);
        emit(mock, 'event name');

        assert(passed);
    });


    it('should get listeners', function () {
        on(mock, 'event name', increment);
        var listeners = getListeners(mock, 'event name');

        assert(listeners.length);
    });

});
