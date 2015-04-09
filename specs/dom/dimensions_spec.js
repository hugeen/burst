import assert from 'core/assert';
import * as dom from 'dom/dimensions';


var specs = [];


var container = document.createElement('div');
document.body.appendChild(container);


function reset() {
    container.style.height = '';
    container.style.width = '';
    container.style.innerHTML = '';
    container.style.position = 'absolute';
    container.style.top = '40px';
    container.style.left = '50px';
}


specs.push(function (done) {
    reset();
    container.style.height = '40px';

    done(assert(dom.getHeight(container) === 40, 'should get element height'));
});


specs.push(function (done) {
    reset();
    container.style.width = '50px';

    done(assert(dom.getWidth(container) === 50, 'should get element width'));
});


specs.push(function (done) {
    reset();
    container.style.width = '50px';
    container.style.height = '40px';

    var {width, height} = dom.getSize(container);
    done(assert(height === 40 && width === 50, 'should get element size'));
});


specs.push(function (done) {
    reset();
    var div = document.createElement('div');
    container.appendChild(div);

    var {top, left} = dom.getPosition(div);
    done(assert(top === 0 && left === 0, 'should get element position'));
});


specs.push(function (done) {
    reset();
    var div = document.createElement('div');
    container.appendChild(div);

    var {top, left} = dom.getOffset(div);
    done(assert(top === 40 && left === 50, 'should get element offset'));
});


specs.push(function (done) {
    reset();
    var div = document.createElement('div');
    container.appendChild(div);

    var {top, left} = dom.getPositionFromViewport(container);
    done(assert(top === 40 && left === 50, 'should get element position from viewport'));
});


export default {name: 'DOM dimensions', specs};
