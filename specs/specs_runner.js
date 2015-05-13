// import 'specs/dom/events_spec';

// import 'specs/dom/utils_spec';
// import 'specs/dom/dimensions_spec';
// import 'specs/dom/accessors_spec';
// import 'specs/transport/http_spec';
// import 'specs/transport/media_spec';
// import 'specs/input/keyboard_spec';


import 'specs/core/event_spec';
import 'specs/core/queue_spec';

import 'specs/time/animation_loop_spec';

import 'specs/dom/traversing_spec';
import 'specs/dom/manipulation_spec';

import {runAll} from 'test/run';

runAll();


// var specsCount = 0;
// var totalPassed = 0;

// function runNextSet(sets, i = 0) {
//     if (i < sets.length) {
//         var set = sets[i];
//         console.group(`%c ${set.name} `, 'font-size: 1.3em;');

//         runNextSpec(set, 0, function () {
//             logResult({count: set.specs.length, passed: set.passed});
//             console.groupEnd();
//             runNextSet(sets, i + 1);
//         });
//     }
// }


// function runNextSpec(set, i, callback) {

//     if (i >= set.specs.length) {
//         callback();
//     } else {
//         set.specs[i](function(result) {
//             output(result);
//             if (result.passed) {
//                 set.passed = (set.passed || 0) + 1;
//             }
//             runNextSpec(set, i + 1, callback);
//         });
//     }
// }


// function output(result) {
//     if (result.passed) {
//         console.log(result.infos.message);
//     } else {
//         console.error(result.infos.stack);
//     }
// }


// function logResult(result, label = '') {
//     var {
//         count, passed
//     } = result;
//     var allPassed = count === passed;
//     var style = 'font-weight: bold;';
//     if (!allPassed) {
//         style += ' color: red;';
//     }

//     console[allPassed ? 'info' : 'warn'](`%c ${label}${passed}/${count}`, style);
// }
