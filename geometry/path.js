function Path (segments) {
    this.segments = segments || [];
}


Path.prototype.type = 'Path';


Path.prototype.clone = function () {
    var segments = [];
    for (var i = 0; i < this.segments.length; i++) {
        segments.push(this.segments[i].clone());
    }

    return new Path(segments);
};


module.exports = Path;
