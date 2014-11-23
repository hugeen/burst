var slice = Array.prototype.slice;

require('../core/model')(Arc);


function Arc (x, y, radius, angles, antiClockwise) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = angles[0];
    this.endAngle = angles[1];
    this.antiClockwise = antiClockwise || false;
}


module.exports = Arc;
