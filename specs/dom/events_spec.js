import assert from 'core/assert';
import * as dom from 'dom/events';


var specs = [];
var passed = 0;

var event = document.createEvent('HTMLEvents');
event.initEvent('custom', true, true);
event.eventName = 'custom';


function reset() {
    passed = 0;
    document.removeEventListener('custom', increment);
}


function increment () {
    passed += 1;
}


specs.push(function (done) {
    reset();

    dom.enableDomEvents();

    done(assert(dom.eventsEnabled, 'should enable dom events'));
});


specs.push(function (done) {
    reset();

    dom.enableDomEvents();
    dom.disableDomEvents();

    done(assert(!dom.eventsEnabled, 'should enable dom events'));
});


specs.push(function (done) {
    reset();

    dom.addListener(document, 'custom', increment);
    document.dispatchEvent(event);

    done(assert(passed, 'should add a listener'));
});


specs.push(function (done) {
    reset();

    document.addEventListener('custom', increment);
    dom.removeListener(document, 'custom', increment);
    document.dispatchEvent(event);

    done(assert(!passed, 'should remove a listener'));
});


specs.push(function (done) {
    reset();

    dom.domReady(increment)

    done(assert(passed, 'should execute a callback on dom ready'));
});


export default {name: 'DOM events', specs};
