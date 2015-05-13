import {describe, it, beforeEach} from 'test/describe';
import should from 'test/should';

import {animationLoop, enableAnimationLoop, disableAnimationLoop} from 'time/animation_loop';
import {on} from 'core/event';


describe('Animation loop', function () {

    var mock;
    var passed;


    function increment () {
        passed += 1;
    }


    beforeEach(function () {
        mock = {};
        passed = 0;
    });


    it('should start the loop', function (done) {
        var object = {};
        on(object, 'enter frame', function (deltaTime) {
            disableAnimationLoop(object);
            done();
        });

        enableAnimationLoop(object);
    });


});

