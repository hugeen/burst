var arrayProto = Array.prototype;

module.exports = function (DomQuery) {

    DomQuery.prototype.length = 0;
    DomQuery.prototype.splice = arrayProto.splice;
    DomQuery.prototype.each = each;

    return DomQuery;
};


function each (iterator, value) {
    arrayProto.forEach.call(this, iterator, value);
}
