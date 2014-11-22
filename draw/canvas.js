require('../core/model.js')(Canvas);


function Canvas (element) {
    this.context = element.getContext('2d');
}


(function (proto) {

    proto.def('drawPath', function (path) {

        this.context.beginPath();

        for (var i = 0; i < path.segments.length; i++) {
            point = path.segments[i];
            this.context[i !== 0 ? 'lineTo' : 'moveTo'](point.x, point.y);
        }

        this.context.fill();

        return this;

    });

})(Canvas.prototype);


module.exports = Canvas;
