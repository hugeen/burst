import assert from 'core/assert';
import * as dom from 'dom/positions';


var specs = [];


var container = document.createElement('div');
document.body.appendChild(container);


function reset() {
    container.style.innerHTML = '';
    container.style.position = 'absolute';
    container.style.top = '40px';
    container.style.left = '50px';
}


specs.push(function () {
    reset();
    var div = document.createElement('div');
    container.appendChild(div);

    var {top, left} = dom.getPosition(div);
    return assert(top === 0 && left === 0, 'should get element position');
});


specs.push(function () {
    reset();
    var div = document.createElement('div');
    container.appendChild(div);

    var {top, left} = dom.getOffset(div);
    return assert(top === 40 && left === 50, 'should get element offset');
});


specs.push(function () {
    reset();
    var div = document.createElement('div');
    container.appendChild(div);

    var {top, left} = dom.getPositionFromViewport(container);
    return assert(top === 40 && left === 50, 'should get element position from viewport');
});


export default {name: 'DOM positions', specs};
