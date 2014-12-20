var AnimationLoop = require('./base');


module.exports = function (callback, bind) {
    return new AnimationLoop(callback, bind);
};
