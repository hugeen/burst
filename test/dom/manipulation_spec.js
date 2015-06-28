import assert from 'assert';
import * as dom from '../../dom/manipulation';


describe('DOM Manipulation', function () {


    var container;

    beforeEach(function () {
        if(container) {
            container.parentNode.removeChild(container);
        }
        container = document.createElement('div');
        document.body.appendChild(container);

        container.innerHTML = '';
        container.style.display = '';
        container.classList.remove('hello');
    });


    it('should show an element', function () {
        container.style.display = 'none';
        dom.show(container);
        assert(container.style.display !== 'none');
    });


    it('should hide an element', function () {
        dom.hide(container);
        assert(container.style.display === 'none');
    });


    it('should add a class to an element', function () {
        dom.addClass(container, 'hello');
        assert(container.classList.contains('hello'));
    });


    it('should remove a class to an element', function () {
        container.classList.add('hello');
        dom.removeClass(container, 'hello');
        assert(!container.classList.contains('hello'));
    });


    it('should check class of an element', function () {
        container.classList.add('hello');
        assert(dom.hasClass(container, 'hello'));
    });


    it('should append an element', function () {
        dom.append(container, document.createElement('h1'));
        dom.append(container, document.createElement('h2'));
        assert(container.innerHTML === '<h1></h1><h2></h2>');
    });


    it('should prepend an element', function () {
        dom.prepend(container, document.createElement('h1'));
        dom.prepend(container, document.createElement('h2'));
        assert(container.innerHTML === '<h2></h2><h1></h1>');
    });


    it('should remove an element', function () {
        var element = document.createElement('h1');
        container.appendChild(element);
        dom.remove(element);
        assert(!container.querySelector('h1'));
    });


    it('should empty an element', function () {
        container.innerHTML = 'hello';
        dom.empty(container);
        assert(container.innerHTML === '');
    });


});
