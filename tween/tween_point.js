var Tween = require('./tween');


module.exports = function (Point) {

    Point.prototype.tween = tween;

    return Point;
};


function tween (destination, time, easing) {

    console.log(this, destination);
    this.transition = new Tween({
        from: this.toArray(),
        to: destination.toArray(),
        duration: 1000,
        easing: 'easeInOutQuint'
    });

    var self = this;
    this.transition.on('update', function(properties) {
        self.fromArray(properties);
    });

    return this;
}
