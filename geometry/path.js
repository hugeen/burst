var slice = Array.prototype.slice;


function Path (segments) {
    this.type = 'Path';
    this.points = segments || [];
}


Path.prototype.addPoint = function () {
    var points = slice.call(arguments);

    for (var i = 0; i < points.length; i++) {
        this.points.push(points[i]);
    }
};


Path.prototype.removePoint = function () {
    var points = slice.call(arguments);

    for (var i = 0; i < points.length; i++) {
        this.points.push(points[i]);
    }
};


module.exports = Path;
