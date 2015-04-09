import assert from 'core/assert';
import {on} from 'core/event';
import {xhrEvents, buildXhr, proxifyXhrEvent, proxifyXhrEvents} from 'transports/xhr';


var specs = [];
var passed = 0;


function reset() {
    passed = 0;
}


function increment (...args) {
    passed += 1;
}


specs.push(function (done) {
    var xhr = buildXhr();
    done(assert(xhr instanceof XMLHttpRequest, 'should make build a new XHR'));
});


specs.push(function (done) {
    reset();
    var xhr = new XMLHttpRequest();

    proxifyXhrEvent(xhr, 'load');
    var e = new Event('load');
    on(xhr, 'load', increment);
    xhr.dispatchEvent(e);

    done(assert(passed, 'should proxify XHR event'));
});


specs.push(function (done) {
    reset();
    var xhr = new XMLHttpRequest();

    proxifyXhrEvents(xhr, xhrEvents);
    xhrEvents.forEach(function (eventName) {
        var e = new Event(eventName);
        on(xhr, eventName, increment);
        xhr.dispatchEvent(e);
    });

    done(assert(passed === xhrEvents.length, 'should proxify XHR events'));
});


export default {name: 'XHR', specs};
