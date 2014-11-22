require('../core/model.js')(Canvas);

function Canvas (element) {

    this.context = element.getContext('2d');

}

module.exports = Canvas;
