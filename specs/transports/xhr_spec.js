import assert from 'core/assert';
import {on} from 'core/event';
import {xhrEventsMap, buildXhr, proxifyXhrEvent, proxifyXhrEvents} from 'transports/xhr';


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


export default {name: 'XHR', specs};
