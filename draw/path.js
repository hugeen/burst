require('../core/model.js')(Path);

function Path() {
    this.segments = [];
}


Path.prototype.def('add', function(point) {
    this.segments.push(point);
});


module.exports = Path;