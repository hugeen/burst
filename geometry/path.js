function Path (points) {
    this.type = 'Path';
    this.points = points || [];
}


Path.prototype.clone = function () {
    var points = [];
    for (var i = 0; i < this.points.length; i++) {
        points.push(this.points[i].clone());
    }
    return new Path(points);
};


module.exports = Path;
