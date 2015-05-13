import {getParamNames} from '../core/utils';
import {contextMap, traverseParents} from './describe';
import {processQueue} from '../core/queue';


export function runAll () {
    var descQueue = [];
    contextMap.forEach(function (context) {

        descQueue.push(function (done) {
            console.group(context.name);
            runSequence(context, function () {
                console.groupEnd();
                done();
            });
        });

    });

    processQueue(descQueue);
};


export function runSequence (context, callback) {
    var specQueue = [];

    context.actions.forEach(function (action) {
        specQueue.push(function (done) {
            traverseParents(context, runBeforeEach);
            tryAction(context, action, function (passed = true) {
                console.log(action.message);
                if(!passed) {
                    console.error(action.error.stack);
                }
                done();
            });
        });
    });

    specQueue.push(function (done) {
        callback();
        done();
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
        action.error = e;
    }

    if (!getParamNames(action.body).length) {
        done(passed);
    }
}

