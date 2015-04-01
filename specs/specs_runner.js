import assertSpecs from "specs/core/assert_spec";
import eventSpecs from "specs/core/event_spec";
import animationLoopSpecs from "specs/time/animation_loop_spec";
import domUtilsSpecs from "specs/dom/all_spec";


var sets = [
    assertSpecs,
    eventSpecs,
    animationLoopSpecs,
    domUtilsSpecs
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
