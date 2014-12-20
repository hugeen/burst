module.exports = function (Canvas) {

    Canvas.prototype.useStyle = useStyle;

    return Canvas;
};


var styleAttrs = [
    'fillStyle', 'strokeStyle',
    'linearGradiant', 'radialGradiant',
    'lineWidth', 'lineCap', 'lineJoin', 'mitterLimit'
];

function useStyle (style) {
    style.use(this.context, styleAttrs);
}
