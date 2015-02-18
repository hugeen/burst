function Size (width, height) {
    this.width = width;
    this.height = height;
}


Size.prototype.type = 'Size';


Size.prototype.clone = function () {
    return new Size(this.width, this.height);
};


Object.defineProperty(Size.prototype, 'ratio', {
    enumerable: true,
    get: function () {
        return this.width / this.height;
    }
});


module.exports = Point;
