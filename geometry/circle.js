function Circle (x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}


Circle.prototype.type = 'Circle';


Circle.prototype.clone = function () {
    return new Circle(this.x, this.y, this.radius);
};


module.exports = Circle;
