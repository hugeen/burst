import assert from 'core/assert';
import * as dom from 'dom/manipulation';


var specs = [];


var container = document.createElement('div');
document.body.appendChild(container);


function reset() {
    container.innerHTML = '';
    container.style.display = '';
    container.classList.remove('hello');
}


specs.push(function (done) {
    reset();
    container.style.display = 'none';
    dom.show(container);

    done(assert(container.style.display !== 'none', 'should show an element'));
});


specs.push(function (done) {
    reset();
    dom.hide(container);

    done(assert(container.style.display === 'none', 'should hide an element'));
});


specs.push(function (done) {
    reset();
    dom.addClass(container, 'hello');

    done(assert(container.classList.contains('hello'), 'should add a class to an element'));
});


specs.push(function (done) {
    reset();
    container.classList.add('hello');
    dom.removeClass(container, 'hello');

    done(assert(!container.classList.contains('hello'), 'should remove a class to an element'));
});


specs.push(function (done) {
    reset();
    container.classList.add('hello');

    done(assert(dom.hasClass(container, 'hello'), 'should check class of an element'));
});


specs.push(function (done) {
    reset();
    dom.append(container, document.createElement('h1'));
    dom.append(container, document.createElement('h2'));

    done(assert(container.innerHTML === '<h1></h1><h2></h2>', 'should append an element'));
});


specs.push(function (done) {
    reset();
    dom.prepend(container, document.createElement('h1'));
    dom.prepend(container, document.createElement('h2'));

    done(assert(container.innerHTML === '<h2></h2><h1></h1>', 'should prepend an element'));
});


specs.push(function (done) {
    reset();
    var element = document.createElement('h1');
    container.appendChild(element)
    dom.remove(element);

    done(assert(!document.querySelector('h1'), 'should remove an element'));
});


specs.push(function (done) {
    reset();
    container.innerHTML = 'hello';
    dom.empty(container);

    done(assert(container.innerHTML === '', 'should empty an element'));
});


export default {name: 'DOM manipulation', specs};
