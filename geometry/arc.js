var slice = Array.prototype.slice;


function Arc (x, y, radius, angles, clockwise) {
    this.type = 'Arc';

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = angles[0];
    this.endAngle = angles[1];
    this.clockwise = clockwise || true;
}


module.exports = Arc;
