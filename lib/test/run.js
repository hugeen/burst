import {getParamNames} from '../core/utils';
import {contextMap, traverseParents} from './describe';
import {processQueue} from '../core/queue';


export function runAll () {
    contextMap.forEach(runSequence);
};


export function runSequence (context) {
    var specQueue = [];

    context.actions.forEach(function (action) {
        specQueue.push(function (done) {
            traverseParents(context, runBeforeEach);
            tryAction(context, action, function (passed = true) {
                console.log(passed);
                done();
            });
        });
    });

    processQueue(specQueue);
};


export function runBeforeEach (context) {
    context.beforeActions.forEach(before => before());
};


function tryAction (context, action, done) {
    var passed = false;

    try {
        action.body(done);
        passed = true;
    } catch (e) {
        // emit(it, 'fail', e);
    }

    if (!getParamNames(action.body).length) {
        done(passed);
    }
}

