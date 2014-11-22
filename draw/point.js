require('../core/model.js')(Point);

function Point (x, y, controlPoints) {
    this.x = x;
    this.y = y;

    this.addControlPoints(controlPoints || []);
    this.controlPoints = [];
}


(function (proto) {

    proto.def('addControlPoints', function (controlPoints) {

        for (var i = 0; i < controlPoints.length; i++) {
            if (i > 1) {
                break;
            }

            this.controlPoints[i] = Point.create(controlPoints[i]);
        }

    });

})(Point.prototype);


module.exports = Point;
