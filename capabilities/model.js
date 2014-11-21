var slice = Array.prototype.slice;


var requiredCapabilities = [
    require('./event.js'),
    require('./hook.js'),
    require('./def.js'),
    require('./tag.js')
];


function modelCapabilities(Model) {

    addCapabilities.call(this, requiredCapabilities);


    Model.hook('create');

    Model.create = function() {
        var instance = Object.create(this);
        this.constructor.call(instance, slice.call(arguments));

        return instance;
    };


    return Model;

}


function addCapabilities(destinations) {
    for (var i in destinations) {
        destinations[i](this);
    }
}


module.exports = modelCapabilities;
