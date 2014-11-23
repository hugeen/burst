function drawArcCapabilities (Canvas) {

    (function (proto) {

        proto.def('drawArc', function (arc) {

            this.context.beginPath();

            this.context.arc(arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle, arc.anticlockwise);

            this.context.stroke();

            return this;

        });

    })(Canvas.prototype);

}


module.exports = drawArcCapabilities;
