module.exports = function (window) {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];


    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        var vendor = vendors[x];

        window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
    }


    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(fnc, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));

            var id = window.setTimeout(function() {
                fnc(currTime + timeToCall);
            }, timeToCall);

            lastTime = currTime + timeToCall;

            return id;
        };
    }


    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }


    return window;
};
