var styleAttrs = [
    'fillStyle', 'strokeStyle',
    'linearGradiant', 'radialGradiant',
    'lineWidth', 'lineCap', 'lineJoin', 'mitterLimit'
];


module.exports = function (Canvas) {

    Canvas.prototype.useStyle = useStyle;

    return Canvas;
};


function useStyle (style) {
    style.use(this.context, styleAttrs);
}