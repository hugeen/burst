var slice = Array.prototype.slice;


function drawDebugFnc(moment) {

    return function() {
        console.log.apply(null, [moment + ' draw'].concat(slice.call(arguments)));
    };

}


module.exports = function(Canvas) {

    (function(proto) {

        proto.hook('draw');

        proto.on('after draw', drawDebugFnc('before'));

        proto.on('after draw', drawDebugFnc('after'));

    })(Canvas.prototype);

};
