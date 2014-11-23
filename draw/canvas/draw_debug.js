var slice = Array.prototype.slice;


function drawDebug (entity) {
    console.log('draw', entity);
}


module.exports = function (Canvas) {

    (function (proto) {

        proto.hook('draw', 'after');

        proto.on('after draw', drawDebug);

    })(Canvas.prototype);

};
