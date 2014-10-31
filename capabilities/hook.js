module.exports = function(object) {

    Object.defineProperty(object, "hooks", {
        value: {}
    });

    Object.defineProperty(object, "hook", {
        value: function(name, settings) {
            object.hooks[name] = settings ? [settings] : ["after", "before"];
        }
    });

};
