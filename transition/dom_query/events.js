module.exports = function (DomQuery) {

    DomQuery.prototype.on = on;
    DomQuery.prototype.removeListener = removeListener;

    return DomQuery;
};


function on (name, fnc) {
    this.each(function (el) {
        el.addEventListener(name, fnc);
    });
}


function removeListener (name, fnc) {
    this.each(function (el) {
        el.removeEventListener(name, fnc);
    });
}
