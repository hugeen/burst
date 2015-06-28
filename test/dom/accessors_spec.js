import assert from 'assert';
import * as dom from '../../dom/accessors';


describe('DOM Accessors', function () {


    var container;

    beforeEach(function () {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
        container.innerHTML = '';
        container.style.display = '';
    });


    it('should get a style property from an element', function () {
        var visibility = dom.getStyle(container, 'visibility');
        assert(visibility === 'visible');
    });


    it('should get all style properties from an element', function () {
        var styles = dom.getStyles(container);
        assert(styles.visibility === 'visible');
    });


    it('should set a style property on an element', function () {
        var element = document.createElement('h1');
        dom.setStyle(element, 'left', '-11px');
        assert(element.style.left === '-11px');
    });


    it('should set many style properties on an element', function () {
        var element = document.createElement('h2');
        dom.setStyles(element, {left: '-12px', right: '-13px'});
        var isStyled = element.style.left === '-12px' && element.style.right === '-13px';
        assert(isStyled);
    });


    it('should get an attribute on an element', function () {
        var element = document.createElement('h1');
        element.setAttribute('data-hello', 'world');
        assert(dom.getAttribute(element, 'data-hello') === 'world');
    });


    it('should set an attribute on an element', function () {
        var element = document.createElement('h1');
        dom.setAttribute(element, 'data-hello', 'world');
        assert(element.getAttribute('data-hello') === 'world');
    });


    it('should set many attributes on an element', function () {
        var element = document.createElement('h1');
        dom.setAttributes(element, {
            'data-hello': 'world',
            'data-foo': 'bar'
        });
        var isSet = element.getAttribute('data-hello') === 'world' && element.getAttribute('data-foo') === 'bar';
        assert(isSet);
    });


});

