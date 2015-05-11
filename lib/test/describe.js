var contextChain = new WeakMap();
var currentContext = null;


export var contextMap = new Map();


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
    currentContext.actions.push({message, body});
};


export function traverseParents (context, callback) {
    getParents(context).forEach(callback);
};


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
