import {getParamNames} from '../core/utils';

var contextChain = new WeakMap();
var contextMap = new Map();
var currentContext = null;


export function describe (name, description) {
    var context = buildContext(name, description);
    contextMap.set(description, context);

    openContext(context);
    description();
    closeContext(context);
};


export function beforeEach (body) {
    currentContext.beforeActions.push(body);
};


export function it (message, body) {
    currentContext.actions.push(body);
};


export function run () {
    contextMap.forEach(runSequence);
};


export function runSequence (context) {
    context.actions.forEach(function (it) {
        traverseParents(context, runBeforeEach);
        tryAction(context, it);
    });
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

    }
}


export function runBeforeEach (context) {
    context.beforeActions.forEach(before => before());
};


export function should (value) {
    if (!value) {
        fail(`Expected truthy but was: ${Object.toString(value)}`);
    }
};


export function fail (message) {
    throw new Error(message);
}


function traverseParents (context, callback) {
    getParents(context).forEach(callback);
}


function getParents (context) {
    var parents = [context];

    (function appendParents (context) {
        var parent = getParent(context)
        if (parent) {
            parents.push(parent);
            appendParents(parent);
        }
    })(context);

    return parents.reverse();
}


function openContext (context) {
    if (currentContext) {
        contextChain.set(context, currentContext);
    }

    currentContext = context;
}


function closeContext (context) {
    currentContext = getParent(context);
}


function buildContext (name, description) {
    var context = {name, beforeActions: [], actions: [], passed: 0};
    Object.defineProperties(context, {
        count: {get: () => this.actions.length}
    });

    return context;
}


function getContext (description) {
    return contextMap.get(description);
}


function getParent (context) {
    if (contextChain.has(context)) {
        return contextChain.get(context);
    } else {
        return null;
    }
}
