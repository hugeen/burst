function Vector (x, y) {
    this.x = x;
    this.y = y;
}


Vector.prototype.clone = function () {
    return new Vector(this.x, this.y);
};


Vector.prototype.plus = function (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
};


Vector.prototype.minus = function (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
};


Vector.prototype.multiply = function (number) {
    return new Vector(this.x * number, this.y * number);
};


Vector.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};


Vector.prototype.normalize = function () {
    return this.multiply(1 / this.length());
};


Vector.prototype.rotate90 = function () {
    return new Vector(-this.y, this.x);
};


Vector.prototype.dotProduct = function (vector) {
    return this.x * vector.x + this.y * vector.y;
};


Vector.prototype.projectOn = function (unitVector) {
    return unitVector.multiply(this.dotProduct(unitVector));
};


module.exports = Vector;
