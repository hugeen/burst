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
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));

            var id = object.setTimeout(function() {
                fnc(currTime + timeToCall);
            }, timeToCall);

            lastTime = currTime + timeToCall;

            return id;
        };
    }


    if (!object.cancelAnimationFrame) {
        object.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }


    return object;
};
