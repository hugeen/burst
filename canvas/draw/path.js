module.exports = function (Canvas) {

    Canvas.prototype.drawPath = drawPath;

    return Canvas;
};


function drawPath (path) {

    this.context.beginPath();

    for (var i = 0; i < path.points.length; i++) {
        var point = path.points[i];
        var operation = !i ? 'moveTo' : 'lineTo';
        this.context[operation].apply(this.context, [point.x, point.y]);
    }

    this.context.stroke();

    return this;

}