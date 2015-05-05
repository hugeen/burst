import {getParamNames} from '../core/utils';
import {contextMap, traverseParents} from './describe';


export function run () {
    contextMap.forEach(runSequence);
};


export function runSequence (context) {
    context.actions.forEach(function (it) {
        traverseParents(context, runBeforeEach);
        tryAction(context, it);
    });
};


export function runBeforeEach (context) {
    context.beforeActions.forEach(before => before());
};


function tryAction (context, it) {
    var passed = false;
    try {
        it(done);
        passed = true;
    } catch (e) {
        // emit(it, 'fail', e);
    }

    if (!getParamNames(it).length) {
        done();
    }
}


function done (passed = true) {
    if (passed) {
        console.log(passed);
    }
}
