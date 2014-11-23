var Arc = require('../arc');

function drawCircleCapabilities (Canvas) {

    (function (proto) {

        proto.def('drawCircle', function (circle) {

            var arc = new Arc(circle.x, circle.y, circle.radius, [0, 360]);
            this.drawArc(arc);

            return this;

        });

    })(Canvas.prototype);

}


module.exports = drawCircleCapabilities;
