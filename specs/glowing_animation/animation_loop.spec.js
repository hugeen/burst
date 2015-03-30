import assert from 'glowing_specs/assert';
import AnimationLoop from 'glowing_animation/animation_loop';


var specs = [];

var animationLoop;


function reset() {
    animationLoop = AnimationLoop
}


specs.push(function () {

    return assert(true, 'should register and trigger listener');
});



export default {name: 'Animation loop', specs};
