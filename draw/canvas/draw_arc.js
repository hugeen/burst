function drawArc (arc) {

    this.context.beginPath();

    this.context.arc(arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle, arc.anticlockwise);

    this.context.stroke();

    return this;

}


module.exports = function (Canvas) {

    (function (proto) {

        proto.def('drawArc', drawArc);

    })(Canvas.prototype);

};
