import assert from 'assert';
import * as dom from '../../dom/dimensions';


describe('DOM Dimensions', function () {


    var container;

    beforeEach(function () {
        if(container) {
            container.parentNode.removeChild(container);
        }
        container = document.createElement('div');
        document.body.appendChild(container);
        container.style.height = '';
        container.style.width = '';
        container.style.innerHTML = '';
        container.style.position = 'absolute';
        container.style.top = '40px';
        container.style.left = '50px';
    });


    it('should get element height', function () {
        container.style.height = '40px';
        assert(dom.getHeight(container) === 40);
    });


    it('should get element width', function () {
        container.style.width = '50px';
        assert(dom.getWidth(container) === 50);
    });


    it('should get element size', function () {
        container.style.width = '50px';
        container.style.height = '40px';

        var {width, height} = dom.getSize(container);
        assert(height === 40 && width === 50);
    });


    it('should get element position', function () {
        var div = document.createElement('div');
        container.appendChild(div);

        var {top, left} = dom.getPosition(div);
        assert(top === 0 && left === 0);
    });


    it('should get element offset', function () {
        var div = document.createElement('div');
        container.appendChild(div);

        var {top, left} = dom.getOffset(div);
        assert(top === 40 && left === 50);
    });


    it('should get element position from viewport', function () {
        var div = document.createElement('div');
        container.appendChild(div);

        var {top, left} = dom.getPositionFromViewport(container);
        assert(top === 40 && left === 50);
    });


});
