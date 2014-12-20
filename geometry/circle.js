var slice = Array.prototype.slice;


function Circle (x, y, radius) {
    this.type = 'Circle';

    this.x = x;
    this.y = y;
    this.radius = radius;
}


Circle.prototype.clone = function () {
    return new Circle(this.x, this.y, this.radius);
};


module.exports = Circle;
