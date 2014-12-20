module.exports = function (Canvas) {

    Canvas.prototype.drawArc = drawArc;

    return Canvas;
};


function drawArc (arc) {
    this.context.beginPath();
    this.context.arc(arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle, arc.anticlockwise);
    this.context.stroke();
}
