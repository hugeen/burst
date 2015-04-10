import assertSpecs from 'specs/core/assert_spec';
import eventSpecs from 'specs/core/event_spec';
import animationLoopSpecs from 'specs/time/animation_loop_spec';
import domTraversingSpecs from 'specs/dom/traversing_spec';
import domEventsSpecs from 'specs/dom/events_spec';
import domManipulationSpecs from 'specs/dom/manipulation_spec';
import domUtilsSpecs from 'specs/dom/utils_spec';
import domDimensionsSpecs from 'specs/dom/dimensions_spec';
import domAccessorsSpecs from 'specs/dom/accessors_spec';
import xhrSpecs from 'specs/transports/xhr_spec';


runNextSet([
    assertSpecs,
    eventSpecs,
    animationLoopSpecs,
    domTraversingSpecs,
    domEventsSpecs,
    domManipulationSpecs,
    domUtilsSpecs,
    domDimensionsSpecs,
    domAccessorsSpecs,
    xhrSpecs
]);


var specsCount = 0;
var totalPassed = 0;

function runNextSet(sets, i = 0) {
    if (i < sets.length) {
        var set = sets[i];
        console.group(`%c ${set.name} `, 'font-size: 1.3em;');

        runNextSpec(set, 0, function () {
            logResult({count: set.specs.length, passed: set.passed});
            console.groupEnd();
            runNextSet(sets, i + 1);
        });
    }
}


function runNextSpec(set, i, callback) {

    if (i >= set.specs.length) {
        callback();
    } else {
        set.specs[i](function(result) {
            output(result);
            if (result.passed) {
                set.passed = (set.passed || 0) + 1;
            }
            runNextSpec(set, i + 1, callback);
        });
    }$
}


function output(result) {
    if (result.passed) {
        console.log(result.infos.message);
    } else {
        console.error(result.infos.stack);
    }
}


function logResult(result, label = '') {
    var {
        count, passed
    } = result;
    var allPassed = count === passed;
    var style = 'font-weight: bold;';
    if (!allPassed) {
        style += ' color: red;';
    }

    console[allPassed ? 'info' : 'warn'](`%c ${label}${passed}/${count}`, style);
}
