module.exports = function (Canvas) {

    Canvas.prototype.drawPath = drawPath;

    return Canvas;
};


function drawPath (path) {

    this.context.beginPath();

    for (var i = 0; i < path.points.length; i++) {
        point = path.points[i];

        var operation = selectDrawingOperation(point, i);
        var drawingArgs = getDrawingArgs.call(point, operation);

        this.context[operation].apply(this.context, drawingArgs);
    }

    this.context.stroke();

    return this;

}


function selectDrawingOperation (point, index) {

    var operations = ['lineTo', 'quadraticCurveTo', 'bezierCurveTo'];

    return !index ? 'moveTo' : operations[point.controlPoints.length];
}


function getDrawingArgs (operation) {

    var point = this;

    var operations = {
        moveTo: function () {
            return [point.x, point.y];
        },
        bezierCurveTo: function () {
            var cp1 = point.controlPoints[0];
            var cp2 = point.controlPoints[1];

            return [
                point.x + cp1.x,
                point.y + cp1.y,
                point.x + cp2.x,
                point.y + cp2.y,
                point.x,
                point.y
            ];
        },
        quadraticCurveTo: function () {
            var cp = point.controlPoints[0];

            return [
                point.x + cp.x,
                point.y + cp.y,
                point.x,
                point.y
            ];
        }
    };

    operations.lineTo = operations.moveTo;

    return operations[operation]();
}
