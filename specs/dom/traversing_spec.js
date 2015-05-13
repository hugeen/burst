import {describe, it, beforeEach} from 'test/describe';
import should from 'test/should';

import * as dom from 'dom/traversing';


describe('DOM Traversing', function () {

    it('should select elements with a CSS selector', function () {
        var body = dom.getElements('body');
        should(body[0] === document.body);
    });

});
