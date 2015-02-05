module.exports = function (object) {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];


    for (var x = 0; x < vendors.length && !object.requestAnimationFrame; ++x) {
        var vendor = vendors[x];

        object.requestAnimationFrame = object[vendor + 'RequestAnimationFrame'];
        object.cancelAnimationFrame = object[vendor + 'CancelAnimationFrame'] || object[vendor + 'CancelRequestAnimationFrame'];
    }


    if (!object.requestAnimationFrame) {
        object.requestAnimationFrame = function(fnc, element) {
            var currentTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currentTime - lastTime));

            lastTime = currentTime + timeToCall;

            return object.setTimeout(function() {
                fnc(currentTime + timeToCall);
            }, timeToCall);
        };
    }


    if (!object.cancelAnimationFrame) {
        object.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }


    return object;
};
