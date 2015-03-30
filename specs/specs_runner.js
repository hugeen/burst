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
    var passed = 0;

    specs.forEach(function (spec) {
        var result = spec();
        if (result.passed) {
            passed += 1;
        }
        output(result);
    });

    console.log(`${passed}/${specs.length}`);
}


function output (result) {
    if (result.passed) {
        console.log(result.infos.message);
    } else {
        console.error(result.infos.stack);
    }
}
