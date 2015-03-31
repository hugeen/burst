import assertSpecs from "specs/glowing_core/assert_spec";
import eventSpecs from "specs/glowing_core/event_spec";
import animationLoopSpecs from "specs/glowing_dom/animation_loop_spec";


var sets = [
    assertSpecs,
    eventSpecs,
    animationLoopSpecs
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
