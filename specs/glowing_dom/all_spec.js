import assert from 'glowing_core/assert';
import dom from 'glowing_dom/all';


var specs = [];
var passed = 0;

var event = document.createEvent('HTMLEvents');
event.initEvent('custom', true, true);
event.eventName = 'custom';


var container = document.createElement('div');
document.body.appendChild(container);
document.readyState = 'complete';

function reset() {
    container.innerHTML = '';
    passed = 0;
    document.removeEventListener('custom', increment);
    delete document.propName;
}


function increment () {
    passed += 1;
}


specs.push(function () {
    var body = dom.getElements('body');
    return assert(body[0] === document.body, 'should select elements with a CSS selector');
});


specs.push(function () {
    reset();

    dom.addListener(document, 'custom', increment);
    document.dispatchEvent(event);

    return assert(passed, 'should add a listener');
});


specs.push(function () {
    reset();

    document.addEventListener('custom', increment);
    dom.removeListener(document, 'custom', increment);
    document.dispatchEvent(event);

    return assert(!passed, 'should remove a listener');
});


specs.push(function () {
    reset();

    dom.domReady(increment)

    return assert(passed, 'should execute a callback on dom ready');
});


specs.push(function () {
    reset();

    var elements = dom.castElements(document);

    return assert(elements.length, 'should cast a dom element into an array on elements');
});


specs.push(function () {
    reset();
    dom.invoke(document, 'addEventListener', 'custom', increment);
    document.dispatchEvent(event);

    return assert(passed, 'should invoke a method on each elements');
});


specs.push(function () {
    reset();
    dom.setProperty(document, 'propName', true);

    return assert(document.propName, 'should set a property on each elements');
});


specs.push(function () {
    reset();
    var isDiv = dom.is(container, 'div');

    return assert(isDiv, 'should check if elements matches with a selector');
});


specs.push(function () {
    reset();
    var isElement = dom.isElement(container);

    return assert(isElement, 'should check if an object is an element');
});


specs.push(function () {
    reset();
    var isWindow = dom.isWindow(window);

    return assert(isWindow, 'should check if an object is a window');
});


export default {name: 'DOM utils', specs};
