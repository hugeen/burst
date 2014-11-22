require('../core/model.js')(Path);


function Path () {
    this.segments = [];
}


(function (proto) {

    proto.def('add', function (point) {
        this.segments.push(point);
    });

})(Path.prototype);


module.exports = Path;
