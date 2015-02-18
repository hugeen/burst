var arrayProto = Array.prototype;


require('./events')(DomQuery);
require('../core/array')(DomQuery.prototype);

function DomQuery (a) {
    this.push(isElement(a) ? [a] : getElements(a));
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
