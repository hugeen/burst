import eventAbilitiesSpecs from "specs/glowing_core/event_abilities.spec";
import animationLoopSpecs from "specs/glowing_animation/animation_loop.spec";
import assertSpecs from "specs/glowing_core/assert.spec";


var sets = [
    eventAbilitiesSpecs,
    animationLoopSpecs,
    assertSpecs
];


sets.forEach(function (set) {
    console.group(set.name);
    runAll(set.specs);
    console.groupEnd();
});


function runAll (specs) {
    specs.forEach(function (spec) {
        output(spec());
    });
}


function output (spec) {
    if (spec.passed) {
        console.log(spec.infos.message);
    } else {
        console.error(spec.infos.stack);
    }
}
