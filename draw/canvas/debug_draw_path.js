var slice = Array.prototype.slice;


function debugDrawPathCapabilities (Canvas) {

    (function (proto) {

        proto.hook('drawPath', 'after');

        proto.on('after drawPath', function(path) {
            console.log('drawPath', path);
        });

    })(Canvas.prototype);

}


module.exports = debugDrawPathCapabilities;
