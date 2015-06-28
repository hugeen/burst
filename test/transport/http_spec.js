import assert from 'assert';
import {on} from '../../core/event';
import {base64html} from '../helpers';
import * as http from '../../transport/http';


describe('HTTP Transport', function () {


    var passed;

    beforeEach(function () {
        passed = 0;
    });


    function increment () {
        passed += 1;
    };


    it('should make build a new request', function () {
        var request = http.buildRequest();
        assert(request instanceof XMLHttpRequest);
    });


    it('should proxify events', function () {
        var request = new XMLHttpRequest();

        http.proxifyEvent(request, 'load');
        var e = new Event('load');
        on(request, 'load', increment);
        request.dispatchEvent(e);
        assert(passed);
    });


    it('should load html data', function (done) {
        http.get(base64html, function () {
            done();
        });
    });

});

