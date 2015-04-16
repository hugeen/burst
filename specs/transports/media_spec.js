import assert from 'core/assert';
import {base64image, failTimeout} from 'specs/specs_helper';
import {enableDomEvents} from 'dom/event';
import {on} from 'core/event';
import {loadImage} from 'transports/media';


var specs = [];

enableDomEvents();

specs.push(function (done) {
    var message = 'should load an image';
    var timeout = failTimeout(done, 100, message);
    loadImage(base64image, function (image) {
        on(image, 'load', function () {
            clearTimeout(timeout);
            done(assert(true, message));
        });
    });
});


export default {name: 'Media transport', specs};
