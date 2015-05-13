import {describe, it, beforeEach} from 'test/describe';
import should from 'test/should';

import * as dom from 'dom/manipulation';


describe('DOM Manipulation', function () {


    var container = document.createElement('div');
    document.body.appendChild(container);


    beforeEach(function () {
        container.innerHTML = '';
        container.style.display = '';
        container.classList.remove('hello');
    });


    it('should show an element', function () {
        container.style.display = 'none';
        dom.show(container);
        should(container.style.display !== 'none');
    });


    it('should hide an element', function () {
        dom.hide(container);
        should(container.style.display === 'none');
    });


    it('should add a class to an element', function () {
        dom.addClass(container, 'hello');
        should(container.classList.contains('hello'));
    });


    it('should remove a class to an element', function () {
        container.classList.add('hello');
        dom.removeClass(container, 'hello');
        should(!container.classList.contains('hello'));
    });


    it('should check class of an element', function () {
        container.classList.add('hello');
        should(dom.hasClass(container, 'hello'));
    });


    it('should append an element', function () {
        dom.append(container, document.createElement('h1'));
        dom.append(container, document.createElement('h2'));
        should(container.innerHTML === '<h1></h1><h2></h2>');
    });


    it('should prepend an element', function () {
        dom.prepend(container, document.createElement('h1'));
        dom.prepend(container, document.createElement('h2'));
        should(container.innerHTML === '<h2></h2><h1></h1>');
    });


    it('should remove an element', function () {
        var element = document.createElement('h1');
        container.appendChild(element)
        dom.remove(element);
        should(!document.querySelector('h1'));
    });


    it('should empty an element', function () {
        container.innerHTML = 'hello';
        dom.empty(container);
        should(container.innerHTML === '');
    });

});
