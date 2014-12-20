require('./capabilities/draw')(Canvas);
require('./capabilities/animate')(Canvas);


function Canvas (el) {
    this.context = el.getContext('2d');
    this.el = el;
}


module.exports = Canvas;
