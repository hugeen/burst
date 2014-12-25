module.exports = function(object) {

    if (!('def' in object)) {
        def.call(this, 'def', def);
    }

    return object;
};


function def (name, settings) {
    if (typeof settings === 'function') {
        settings = {value: settings};
    }

    return Object.defineProperty(this, name, settings);
}
