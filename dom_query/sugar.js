var DomQuery = require('./base');


// Argument (a) can be element, selector or domReady function
module.exports = function $ (a) {
    return typeof a === 'function' ? domReady(a) : new DomQuery(a);
};


function onDomReady (fnc) {
    return document.readyState === 'complete' ? fnc() : $(document).on('DOMContentLoaded', fnc);
}
