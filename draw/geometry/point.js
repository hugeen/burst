var slice = Array.prototype.slice;


function Point (x, y, controlPoints) {
    this.x = x;
    this.y = y;

    this.controlPoints = [];
    this.addControlPoints(controlPoints || []);
}


Point.prototype.addControlPoints = function (cpts) {
    for (var i = 0; i < cpts.length; i++) {
        this.controlPoints[i] = new Point(cpts[i].x, cpts[i].y);
    }
};


module.exports = Point;
