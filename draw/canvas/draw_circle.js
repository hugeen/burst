module.exports = function (Canvas) {

    Canvas.prototype.drawCircle = drawCircle;

    return Canvas;
};


var Arc = require('../../geometry/arc');

function drawCircle (circle) {

    var arc = new Arc(circle.x, circle.y, circle.radius, [0, 360]);
    this.drawArc(arc);

    return this;

}
