var DomQuery = require('./base');

module.exports = function $ (a) {
    return typeof a === 'function' ? onDomReady(a) : new DomQuery(a);
};


function onDomReady (fnc) {
    return document.readyState === 'complete' ? fnc() : $(document).on('DOMContentLoaded', fnc);
}
