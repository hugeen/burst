require('../core/model')(Canvas);
require('./canvas/draw_path')(Canvas);
require('./canvas/draw_path_debug')(Canvas);
require('./canvas/draw_arc')(Canvas);
require('./canvas/draw_circle')(Canvas);
require('./canvas/stylizing')(Canvas);


function Canvas (el) {
    this.context = el.getContext('2d');
    this.el = el;
}


(function (proto) {

    proto.def('clear', function () {
        this.context.clearRect(0, 0, this.el.width, this.el.height);
    });

})(Canvas.prototype);


module.exports = Canvas;
