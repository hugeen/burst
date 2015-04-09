import assert from 'core/assert';
import * as dom from 'dom/traversing';


var specs = [];


specs.push(function (done) {
    var body = dom.getElements('body');
    done(assert(body[0] === document.body, 'should select elements with a CSS selector'));
});


export default {name: 'DOM traversing', specs};
