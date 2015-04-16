import assert from 'core/assert';
import * as dom from 'input/keyboard';


var specs = [];


specs.push(function (done) {
    done(assert(true, '...'));
});


export default {name: 'Keyboard', specs};
