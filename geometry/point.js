require('../tween/tween_point')(Point);


function Point (x, y, controlPoints) {
    this.x = x;
    this.y = y;

    this.controlPoints = controlPoints || [];
}


Point.prototype.toArray = function () {
    var controlPoints = [];

    for (var i = 0; i < this.controlPoints.length; i++) {
        controlPoints.push(this.controlPoints[i].toArray());
    }

    return [this.x, this.y, controlPoints];
};


Point.prototype.fromArray = function (raw) {
    this.x = raw[0];
    this.y = raw[1];
    console.log(raw);
    for (var i = 0; i < this.controlPoints.length; i++) {
        this.controlPoints[i].fromArray(raw[2][i]);
    }
    console.log(this);
};


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
