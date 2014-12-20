require('./draw')(Canvas);
require('./draw/path')(Canvas);
require('./draw/arc')(Canvas);
require('./draw/circle')(Canvas);
require('./style')(Canvas);


function Canvas (el) {
    this.context = el.getContext('2d');
    this.el = el;
}


module.exports = Canvas;
