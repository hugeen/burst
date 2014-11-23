var slice = Array.prototype.slice;

require('../core/model')(Circle);


function Circle (x, y, radius) {
    this.type = 'Circle';

    this.x = x;
    this.y = y;
    this.radius = radius;
}


module.exports = Circle;
