var arrayProto = Array.prototype;


// Argument (a) can be element or selector
function DomQuery (a) {
    arrayProto.push.apply(this, isElement(a) ? [a] : getElements(a));
}


function getElements (selector) {
    return isSelector(selector) ? document.querySelectorAll(selector) : undefined;
}


function isElement (element) {
    return element && element.nodeType;
}


function isSelector (selector) {
    return '' + selector === selector;
}


module.exports = DomQuery;
