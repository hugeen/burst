import assert from 'assert';
import * as dom from '../../dom/traversing';


describe('DOM Traversing', function () {

    it('should select elements with a CSS selector', function () {
        var body = dom.getElements('body');
        assert(body[0] === document.body);
    });

});
