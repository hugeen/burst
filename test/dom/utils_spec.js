
import assert from 'assert';
import * as dom from '../../dom/utils';


describe('DOM Utils', function () {


    var container;
    var event;
    var passed;


    function increment () {
        passed += 1;
    }


    beforeEach(function () {
        if(container) {
            container.parentNode.removeChild(container)
        }
        container = document.createElement('div');
        document.body.appendChild(container);

        event = document.createEvent('HTMLEvents');
        event.initEvent('custom', true, true);
        event.eventName = 'custom';

        document.removeEventListener('custom', increment);
        delete document.propName;
        passed = 0;
    });


    it('should cast a dom element into an array on elements', function () {
        var elements = dom.toElementList(document);
        assert(elements.length);
    });


    it('should cast an array of elements into a dom element', function () {
        var element = dom.eachElement([document], increment);
        assert(passed);
    });


    it('should iterate on an array of elements', function () {
        var element = dom.toElement([document]);
        assert(element === document);
    });


    it('should invoke a method on each elements', function () {
        dom.invoke(document, 'addEventListener', 'custom', increment);
        document.dispatchEvent(event);
        assert(passed);
    });


    it('should set a property on each elements', function () {
        dom.setProperty(document, 'propName', true);
        assert(document.propName);
    });


    it('should check if elements matches with a selector', function () {
        var check = dom.is(container, 'div');
        assert(check);
    });


    it('should check if an object is an element', function () {
        var check = dom.isElement(container);
        assert(check);
    });


    it('should check if an object is a window', function () {
        var check = dom.isWindow(window);
        assert(check);
    });


    it('should check if an object is a node list', function () {
        var check = dom.isNodeList(document.querySelectorAll('div'));
        assert(check);
    });


    it('should check if an object is an element list', function () {
        var check = dom.isElementList([document, document.body]);
        assert(check);
    });


});
