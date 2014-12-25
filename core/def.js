module.exports = function(object) {

    def.call(this, 'def', {value: def});

    return object;
};


function def (name, settings) {
    return Object.defineProperty(this, name, settings);
}
