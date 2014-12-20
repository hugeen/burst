function Curve (handles) {
    this.handles = handles;
    this.type = (handles.length > 1 ? 'Bezier' : 'Quadratic') + this.type;
}


Curve.prototype.type = 'Curve';


Curve.prototype.clone = function () {
    var handles = [];
    for (var i = 0; i < this.handles.length; i++) {
        handles.push(this.handles[i].clone());
    }

    return new Curve(handles);
};


module.exports = Curve;
