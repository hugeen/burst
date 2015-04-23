// describe('spec', function (it, beforeFilter) {

//     it('hello', function (done) {
//         should(true);
//     });

// });


var contextChain = new WeakMap();
var contextMap = new Map();
var currentContext = null;


export function describe (name, description) {
    openContext(buildContext(name, description));
    description();
    closeContext();
};


export function beforeEach (body) {
    currentContext.before.push(body);
};


export function it (message, body) {
    currentContext.sequence.push(body);
};


export function run () {
    contextMap.forEach(runSequence);
};


export function runSequence (context) {
    context.sequence.forEach(function (it) {
        traverseParents(context, runBeforeEach);
        it();
    });
};


export function runBeforeEach (context) {
    context.before.forEach(b => b());
};


function traverseParents (context, callback) {
    getParents(context).forEach(callback);
};


function getParents (context) {
    var parents = [context];

    (function buildParents (context) {
        var parent = getParent(context)
        if (parent) {
            parents.push(parent);
            buildParents(parent);
        }
    })(context);

    return parents.reverse();
};

function openContext (context) {
    if (currentContext) {
        contextChain.set(context, currentContext);
    }

    currentContext = context;
}


function closeContext () {
    currentContext = getParent(currentContext);
}


function buildContext (name, description) {
    var context = {
        name,
        before: [],
        sequence: []
    };
    contextMap.set(description, context);

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
