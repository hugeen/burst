var drawCapabilities = [
    require('./draw/path'),
    require('./draw/arc'),
    require('./draw/circle')
];


module.exports = function (Canvas) {

    addDrawCapabilities(Canvas);

    Canvas.prototype.clear = clear;
    Canvas.prototype.draw = draw;

    return Canvas;
};


function addDrawCapabilities (Canvas) {

    for (var i = 0; i < drawCapabilities.length; i++) {
        drawCapabilities[i](Canvas);
    }
}


function clear () {
    this.context.clearRect(0, 0, this.el.width, this.el.height);
}


function draw (entity) {
    this['draw' + entity.type](entity);
}
