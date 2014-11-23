var Arc = require('../arc');


function drawCircle (circle) {

    var arc = new Arc(circle.x, circle.y, circle.radius, [0, 360]);
    this.drawArc(arc);

    return this;

}


module.exports = function (Canvas) {

    (function (proto) {

        proto.def('drawCircle', drawCircle);

    })(Canvas.prototype);

};
