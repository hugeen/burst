var slice = Array.prototype.slice;


function Path () {
    this.type = 'Path';
    this.segments = [];
}


Path.prototype.add = function () {
    var points = slice.call(arguments);

    for (var i = 0; i < points.length; i++) {
        this.segments.push(points[i]);
    }
};


module.exports = Path;
