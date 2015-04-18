import assert from 'core/assert';
import {on} from 'core/event';
import * as http from 'transports/http';


var specs = [];
var passed = 0;


function reset() {
    passed = 0;
}


function increment (...args) {
    passed += 1;
}


specs.push(function (done) {
    var request = http.buildRequest();
    done(assert(request instanceof XMLHttpRequest, 'should make build a new request'));
});


specs.push(function (done) {
    reset();
    var request = new XMLHttpRequest();

    http.proxifyEvent(request, 'load');
    var e = new Event('load');
    on(request, 'load', increment);
    request.dispatchEvent(e);

    done(assert(passed, 'should proxify events'));
});


export default {name: 'Http', specs};
