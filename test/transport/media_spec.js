import {base64image} from '../helpers';
import {enableDomEvents} from '../../dom/event';
import {on} from '../../core/event';
import {loadImage} from '../../transport/media';
import assert from 'assert';


describe('Transport Media', function () {


    beforeEach(function () {
        enableDomEvents();
    });


    it('should load an image', function (done) {

        loadImage(base64image, function (image) {
            console.log(image);
            on(image, 'load', function () {
                console.log('loaded');
                done();
            });
        });
    });


});
