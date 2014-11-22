function drawPathCapabilities (Canvas) {

    (function (proto) {

        proto.def('drawPath', function (path) {

            this.context.beginPath();

            for (var i = 0; i < path.segments.length; i++) {
                point = path.segments[i];

                var operation = selectDrawingOperation(point, i);
                var drawingArgs = getDrawingArgs.call(point, operation);

                this.context[operation].apply(this.context, drawingArgs);
            }

            this.context.stroke();

            return this;

        });

    })(Canvas.prototype);

}


function getDrawingArgs (operation) {

    var point = this;

    var operations = {
        moveTo: function () {
            return [point.x, point.y];
        },
        bezierCurveTo: function () {
            return [
                point.controlPoints[0].x,
                point.controlPoints[0].y,
                point.controlPoints[1].x,
                point.controlPoints[1].y,
                point.x,
                point.y
            ];
        },
        quadraticCurveTo: function () {
            return [
                point.controlPoints[0].x,
                point.controlPoints[0].y,
                point.x,
                point.y
            ];
        }
    };

    operations.lineTo = operations.moveTo;

    return operations[operation]();
}


function selectDrawingOperation (point, index) {
    var operation = 'moveTo';

    if (index !== 0) {
        switch (point.controlPoints.length) {
            case 0:
                operation = 'lineTo';
                break;
            case 1:
                operation = 'quadraticCurveTo';
                break;
            case 2:
                operation = 'bezierCurveTo';
                break;
        }
    }
    return operation;
}


module.exports = drawPathCapabilities;
