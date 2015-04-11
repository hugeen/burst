import assert from 'core/assert';
import {base64image, failTimeout} from 'specs/specs_helper';
import {addListener} from 'dom/events';
import {loadImage} from 'transports/media';


var specs = [];


specs.push(function (done) {
    var message = 'should load an image';
    var timeout = failTimeout(done, 100, message);
    loadImage(base64image, function (image) {
        addListener(image, 'load', function () {
            clearTimeout(timeout);
            done(assert(true, message));
        });
    });
});


export default {name: 'Media transport', specs};
