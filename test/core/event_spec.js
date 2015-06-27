import {
    on, emit, removeListener, getListeners,
    globalOn, globalEmit, globalRemoveListener, globalListeners
} from '../../core/event';

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



    it('should trigger multiple listeners', function () {
        on(mock, 'event name', increment);
        on(mock, 'event name', increment);
        on(mock, 'event name', increment);
        emit(mock, 'event name');

        assert(passed === 3);
    });


    it('assert remove a listener', function () {
        on(mock, 'event name', increment);
        removeListener(mock, 'event name', increment);
        emit(mock, 'event name');

        assert(!passed);
    });


    it('should not remove listener', function () {
        on(mock, 'event name', increment);
        removeListener(mock, 'event name', function() {});
        var listeners = getListeners(mock, 'event name');

        assert(listeners.length);
    });


    it('should forward parameters', function () {
        var param1;
        var param2;

        on(mock, 'custom', function (p1, p2) {
            param1 = p1;
            param2 = p2;
        });

        emit(mock, 'custom', true, false);

        assert(param1 && !param2);
    });


    it('should work with array', function () {
        var array = [1, 2, 3];
        var count;

        on(array, 'custom', function () {
            this.push(4);
        });

        on(array, 'custom', function () {
            this.push(5);
        });

        emit(array, 'custom');

        assert(array.length === 5);
    });


    it('should work with functions', function () {
        on(increment, 'custom', function () {
            this();
        });

        emit(increment, 'custom');

        assert(passed);
    });


    it('should register and trigger global listener', function () {
        globalOn('event name', increment);
        globalEmit('event name');
        globalRemoveListener('event name', increment);

        assert(passed);
    });


    it('should trigger global listener on local listener added', function () {
        globalOn('listener added', increment);
        on(mock, 'event name', function () {});
        globalRemoveListener('listener added', increment);

        assert(passed);
    });

});
