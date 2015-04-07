import assert from 'core/assert';
import * as dom from 'dom/dimensions';


var specs = [];


var container = document.createElement('div');
document.body.appendChild(container);


function reset() {
    container.style.height = '';
}


specs.push(function () {
    reset();
    container.style.height = '40px';

    return assert(dom.getHeight(container) === 40, 'should get element height');
});


export default {name: 'DOM dimensions', specs};
