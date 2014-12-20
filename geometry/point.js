function Point (x, y) {
    this.x = x;
    this.y = y;
}


Point.prototype.type = 'Point';


Point.prototype.clone = function () {
    return new Point(this.x, this.y);
};


module.exports = Point;
