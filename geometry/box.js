function Box (coords, size) {
    this.size = size;
    this.coords = coords;
}


Box.prototype.type = 'Box';


Box.prototype.clone = function () {
    return new Box(this.coords, this.size);
};


module.exports = Box;
