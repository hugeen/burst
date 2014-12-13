function Curve (controlPoints) {
    this.controlPoints = controlPoints;
    this.type = (controlPoints.length > 1 ? 'Bezier' : 'Quadratic') + 'Curve';
}

Curve.prototype.clone = function () {
    var controlPoints = [];
    for (var i = 0; i < this.controlPoints.length; i++) {
        controlPoints.push(this.controlPoints[i].clone());
    }

    return new Curve(controlPoints);
};


module.exports = Curve;
