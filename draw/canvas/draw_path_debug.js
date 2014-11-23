var slice = Array.prototype.slice;


function debugDrawPath (path) {
    console.log('drawPath', path);
}


module.exports = function (Canvas) {

    (function (proto) {

        proto.hook('drawPath', 'after');

        proto.on('after drawPath', debugDrawPath);

    })(Canvas.prototype);

};
