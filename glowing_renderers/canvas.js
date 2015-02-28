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
		console.log(path);
	}

}
