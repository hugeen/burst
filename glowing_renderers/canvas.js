export default class Canvas {

	constructor (el) {
		this.el = el;
		this.context = el.getContext('2d');
	}


	clear () {
    	this.context.clearRect(0, 0, this.el.width, this.el.height);
	}


	draw (entity) {
    	this['draw' + entity.type](entity);
	}

	drawPath (path) {
		this.context.beginPath();

		var first = true;
		for (var point of path) {
			var operation = first ? 'moveTo' : 'lineTo';
			this.context[operation](point.x, point.y);
			first = false;
		}

    	this.context.stroke();
	}

}
