module.exports = function (Point) {

    Point.prototype.tween = tween;

    return Point;
};


function tween (destination, time, easing) {



    return this;
}
