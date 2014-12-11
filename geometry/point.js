require('../tween/tween_point')(Point);


function Point (x, y) {
    this.type = 'Point';

    this.x = x;
    this.y = y;
}


module.exports = Point;
