require('../core/model.js')(Point);

function Point (x, y, controlPoints) {
    this.x = x;
    this.y = y;
    this.controlPoints = controlPoints || null;
}


(function (proto) {

    PointProto.def('addControlPoint', function () {

    });

})(Point.prototype);


module.exports = Point;
