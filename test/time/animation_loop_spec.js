import assert from 'assert';
import {animationLoop, enableAnimationLoop, disableAnimationLoop} from '../../time/animation_loop';
import {on} from '../../core/event';


describe('Animation Loop', function () {

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

