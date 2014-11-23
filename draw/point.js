var slice = Array.prototype.slice;

require('../core/model')(Point);


function Point (x, y, controlPoints) {

    this.x = x;
    this.y = y;
    this.controlPoints = [];

    this.addControlPoints(controlPoints || []);
}


(function (proto) {

    proto.def('addControlPoints', function (controlPoints) {

        for (var i = 0; i < controlPoints.length; i++) {
            this.controlPoints[i] = Point.create.apply(Point, controlPoints[i]);
        }

    });

})(Point.prototype);


module.exports = Point;
