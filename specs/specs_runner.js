import assertSpecs from "specs/core/assert_spec";
import eventSpecs from "specs/core/event_spec";
import animationLoopSpecs from "specs/time/animation_loop_spec";
import domTraversingSpecs from "specs/dom/traversing_spec";
import domEventsSpecs from "specs/dom/events_spec";
import domManipulationSpecs from "specs/dom/manipulation_spec";
import domUtilsSpecs from "specs/dom/utils_spec";
import domDimensionsSpecs from "specs/dom/dimensions_spec";
import domAccessorsSpecs from "specs/dom/accessors_spec";
import domPositionsSpecs from "specs/dom/positions_spec";
import xhrSpecs from "specs/transports/xhr_spec";


var sets = [
    assertSpecs,
    eventSpecs,
    animationLoopSpecs,
    domTraversingSpecs,
    domEventsSpecs,
    domManipulationSpecs,
    domUtilsSpecs,
    domDimensionsSpecs,
    domAccessorsSpecs,
    domPositionsSpecs,
    xhrSpecs
];


var totalTime = 0;
var passed = 0;
var count = 0;
sets.forEach(function (set) {
    console.group(`%c ${set.name} `, 'font-size: 1.3em;');
    var result = runAll(set.specs);

    passed += result.passed;
    totalTime += result.totalTime;
    count += result.count;

    console.groupEnd();
});

logResult({count, passed, totalTime}, 'Total - ');


function runAll (specs) {
    let passed = 0;
    let totalTime = 0;
    var count = specs.length;

    specs.forEach(function (spec) {
        var start = (new Date().getTime());
        let result = spec();
        var elapsed = (new Date().getTime())-start;
        totalTime += elapsed;

        if (result.passed) {
            passed += 1;
        }

        output(result, elapsed);
    });

    logResult({count, passed, totalTime});

    return {count, passed, totalTime};
}


function output (result, elapsed) {
    if (result.passed) {
        console.log(result.infos.message, `${elapsed}ms`);
    } else {
        console.error(result.infos.stack, `${elapsed}ms`);
    }
}


function logResult (result, label = '') {
    var {count, passed, totalTime} = result;
    var allPassed = count === passed;
    var style = 'font-weight: bold;';
    if (!allPassed) {
        style += ' color: red;';
    }

    console[allPassed ? 'info' : 'warn'](`%c ${label}${passed}/${count} in ${totalTime}ms `, style);
}
