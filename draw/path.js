var slice = Array.prototype.slice;

require('../core/model')(Path);


function Path () {
    this.type = 'Path';
    this.segments = [];
}


(function (proto) {

    proto.def('add', function () {

        var points = slice.call(arguments);
        for (var i = 0; i < points.length; i ++) {
            this.segments.push(points[i]);
        }

    });

})(Path.prototype);


module.exports = Path;
