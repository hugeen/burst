var slice = Array.prototype.slice;


function addCapabilities(Model) {
    Model.forward([
        require('./event.js'),
        require('./hook.js'),
        require('./def.js'),
        require('./tag.js')
    ]);
}


module.exports = function(Model) {

    addCapabilities(Model);


    Model.hook('create');

    Model.create = function() {
        var instance = Object.create(this);
        this.constructor.call(instance, slice.call(arguments));

        return instance;
    };


    return Model;

};

