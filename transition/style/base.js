function Style (attrs) {
    for (var key in attrs) {
        this.attrs[key] = attrs[key];
    }
}


Style.prototype.use = function (object, permitAttrs) {
    for (var key in this.attrs) {
        if (permitAttrs.indexOf(key) !== -1) {
            object[key] = this.attrs[key];
        }
    }
};


module.exports = Style;
