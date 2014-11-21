var slice = Array.prototype.slice;


var requiredCapabilities = [
    require('./event.js'),
    require('./def.js'),
    require('./tag.js')
];


function modelCapabilities(Model) {

    addCapabilities.call(Model, requiredCapabilities);


    Model.hook('create');

    Model.def('create', function() {
        var instance = Object.create(Model.prototype);
        Model.apply(instance, slice.call(arguments));

        return instance;
    });


    return Model;

}


function addCapabilities(destinations) {
    for (var i in destinations) {
        destinations[i](this);
    }
}


module.exports = modelCapabilities;
