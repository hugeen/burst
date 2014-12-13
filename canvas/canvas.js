require('./canvas/draw_path')(Canvas);
require('./canvas/draw_arc')(Canvas);
require('./canvas/draw_circle')(Canvas);
require('./canvas/animate')(Canvas);


function Canvas (el) {
    this.context = el.getContext('2d');
    this.el = el;
}


Canvas.prototype.clear = function () {
    this.context.clearRect(0, 0, this.el.width, this.el.height);
};


Canvas.prototype.draw = function (entity) {
    this['draw' + entity.type](entity);
};


module.exports = Canvas;
