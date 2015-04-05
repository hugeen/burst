import assert from 'core/assert';
import * as dom from 'dom/manipulation';


var specs = [];
var passed = 0;


var container = document.createElement('div');
document.body.appendChild(container);


function reset() {
    container.innerHTML = '';
    container.style.display = ''
    container.classList.remove('hello');
}


specs.push(function () {
    reset();
    container.style.display = 'none';
    dom.show(container);

    return assert(container.style.display !== 'none', 'should show an element');
});


specs.push(function () {
    reset();
    dom.hide(container);

    return assert(container.style.display === 'none', 'should hide an element');
});


specs.push(function () {
    reset();
    dom.addClass(container, 'hello');

    return assert(container.classList.contains('hello'), 'should add a class to an element');
});


specs.push(function () {
    reset();
    container.classList.add('hello');
    dom.removeClass(container, 'hello');

    return assert(!container.classList.contains('hello'), 'should remove a class to an element');
});


specs.push(function () {
    reset();
    container.classList.add('hello');

    return assert(dom.hasClass(container, 'hello'), 'should check class of an element');
});


specs.push(function () {
    reset();
    dom.append(container, document.createElement('h1'));
    dom.append(container, document.createElement('h2'));

    return assert(container.innerHTML === '<h1></h1><h2></h2>', 'should append an element');
});


specs.push(function () {
    reset();
    dom.prepend(container, document.createElement('h1'));
    dom.prepend(container, document.createElement('h2'));

    return assert(container.innerHTML === '<h2></h2><h1></h1>', 'should prepend an element');
});


specs.push(function () {
    reset();
    container.innerHTML = 'hello';
    dom.empty(container);

    return assert(container.innerHTML === '', 'should empty an element');
});


export default {name: 'DOM manipulation', specs};
