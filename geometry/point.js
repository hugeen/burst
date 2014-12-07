function Point (x, y, controlPoints) {
    this.x = x;
    this.y = y;

    this.controlPoints = controlPoints || [];
}


Point.prototype.clone = function () {
    var controlPoints = [];
    for (var i = 0; i < this.controlPoints.length; i++) {
        controlPoints.push(this.controlPoints[i].clone());
    }

    return new Point(this.x, this.y, controlPoints);
};


Point.prototype.translate = function (x, y) {
    this.x += x;
    this.y += y;
};


module.exports = Point;
