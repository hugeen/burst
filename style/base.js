var styleAttrs = [
    'fillStyle', 'strokeStyle',
    'linearGradiant', 'radialGradiant',
    'lineWidth', 'lineCap', 'lineJoin', 'mitterLimit'
];


function Style (attrs) {
    for (var key in attrs) {
        if (isPermit(key)) {
            this.attrs[key] = attrs[key];
        }
    }
}


Style.prototype.use = function (object) {
    for (var key in this.attrs) {
        object[key] = this.attrs[key];
    }
};


function isPermit (key) {
    return styleAttrs.indexOf(key) !== -1;
}


module.exports = Style;
