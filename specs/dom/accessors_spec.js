import assert from 'core/assert';
import * as dom from 'dom/accessors';


var specs = [];


var container = document.createElement('div');
document.body.appendChild(container);


function reset() {
    container.innerHTML = '';
    container.style.display = '';
}


specs.push(function (done) {
    reset();
    var visibility = dom.getStyle(container, 'visibility');

    done(assert(visibility === 'visible', 'should get a style property from an element'));
});


specs.push(function (done) {
    reset();
    var styles = dom.getStyles(container);

    done(assert(styles.visibility === 'visible', 'should get all style properties from an element'));
});


specs.push(function (done) {
    reset();
    var element = document.createElement('h1');
    dom.setStyle(element, 'left', '-11px');

    done(assert(element.style.left === '-11px', 'should set a style property on an element'));
});


specs.push(function (done) {
    reset();
    var element = document.createElement('h2');
    dom.setStyles(element, {left: '-12px', right: '-13px'});
    var isStyled = element.style.left === '-12px' && element.style.right === '-13px';

    done(assert(isStyled, 'should set many style properties on an element'));
});


specs.push(function (done) {
    reset();
    var element = document.createElement('h1');
    element.setAttribute('data-hello', 'world');

    done(assert(dom.getAttribute(element, 'data-hello') === 'world', 'should get an attribute on an element'));
});


specs.push(function (done) {
    reset();
    var element = document.createElement('h1');
    dom.setAttribute(element, 'data-hello', 'world');

    done(assert(element.getAttribute('data-hello') === 'world', 'should set an attribute on an element'));
});


specs.push(function (done) {
    reset();
    var element = document.createElement('h1');
    dom.setAttributes(element, {
        'data-hello': 'world',
        'data-foo': 'bar'
    });
    var isSet = element.getAttribute('data-hello') === 'world' && element.getAttribute('data-foo') === 'bar';

    done(assert(isSet, 'should set many attributes on an element'));
});


export default {name: 'DOM accessors', specs};
