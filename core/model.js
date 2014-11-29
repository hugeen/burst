var slice = Array.prototype.slice;

var eventCapabilities = require('./event');
var defCapabilities = require('./def');
var tagCapabilities = require('./tag');


module.exports = function(Model) {

    addCapabilities.call(Model, [
        eventCapabilities,
        defCapabilities,
        tagCapabilities
    ]);

    addCapabilities.call(Model.prototype, [
        eventCapabilities,
        defCapabilities
    ]);


    Model.create = function () {
        var instance = Object.create(Model.prototype);
        Model.apply(instance, slice.call(arguments));

        return instance;
    };


    return Model;

};


function addCapabilities(destinations) {
    for (var i in destinations) {
        destinations[i](this);
    }
}
