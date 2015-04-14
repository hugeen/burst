import assert from 'core/assert';
import * as dom from 'dom/utils';


var specs = [];
var passed = 0;

var event = document.createEvent('HTMLEvents');
event.initEvent('custom', true, true);
event.eventName = 'custom';


var container = document.createElement('div');
document.body.appendChild(container);


function reset() {
    passed = 0;
    document.removeEventListener('custom', increment);
    delete document.propName;
}


function increment () {
    passed += 1;
}



specs.push(function (done) {
    reset();
    var elements = dom.toElementList(document);

    done(assert(elements.length, 'should cast a dom element into an array on elements'));
});


specs.push(function (done) {
    reset();
    var element = dom.eachElement([document], increment);

    done(assert(passed, 'should cast an array of elements into a dom element'));
});


specs.push(function (done) {
    reset();
    var element = dom.toElement([document]);

    done(assert(element === document, 'should iterate on an array of elements'));
});


specs.push(function (done) {
    reset();
    dom.invoke(document, 'addEventListener', 'custom', increment);
    document.dispatchEvent(event);

    done(assert(passed, 'should invoke a method on each elements'));
});


specs.push(function (done) {
    reset();
    dom.setProperty(document, 'propName', true);

    done(assert(document.propName, 'should set a property on each elements'));
});


specs.push(function (done) {
    reset();
    var check = dom.is(container, 'div');

    done(assert(check, 'should check if elements matches with a selector'));
});


specs.push(function (done) {
    reset();
    var check = dom.isElement(container);

    done(assert(check, 'should check if an object is an element'));
});


specs.push(function (done) {
    reset();
    var check = dom.isWindow(window);

    done(assert(check, 'should check if an object is a window'));
});


specs.push(function (done) {
    reset();
    var check = dom.isNodeList(document.querySelectorAll('div'));

    done(assert(check, 'should check if an object is a node list'));
});


specs.push(function (done) {
    reset();
    var check = dom.isElementList([document, document.body]);

    done(assert(check, 'should check if an object is an element list'));
});


specs.push(function (done) {
    reset();
    var check = dom.isElementList([document, document.body]);

    done(assert(check, 'should check if an object is an element or an element list'));
});


export default {name: 'DOM utils', specs};
