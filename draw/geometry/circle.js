var slice = Array.prototype.slice;


function Circle (x, y, radius) {
    this.type = 'Circle';

    this.x = x;
    this.y = y;
    this.radius = radius;
}


module.exports = Circle;
