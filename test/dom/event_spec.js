import assert from 'assert';
import * as dom from '../../dom/event';
import {on, removeListener} from '../../core/event';


describe('DOM Event', function () {


    var event;
    var passed;


    function increment () {
        passed += 1;
    }


    beforeEach(function () {
        event = document.createEvent('HTMLEvents');
        event.initEvent('custom', true, true);
        event.eventName = 'custom';
        dom.enableDomEvents();
        passed = 0;
        document.removeEventListener('custom', increment);
    });


    it('should enable dom events', function () {
        assert(dom.eventsEnabled);
    });


    it('should disable dom events', function () {
        dom.disableDomEvents();
        assert(!dom.eventsEnabled);
    });


    it('should add a listener', function () {
        on(document, 'custom', increment);
        document.dispatchEvent(event);
        assert(passed);
    });


    it('should remove a listener', function () {
        document.addEventListener('custom', increment);
        removeListener(document, 'custom', increment);
        document.dispatchEvent(event);

        assert(!passed);
    });


    it('should execute a callback on dom ready', function (done) {
        dom.domReady(function () {
            done();
        });
    });


});

