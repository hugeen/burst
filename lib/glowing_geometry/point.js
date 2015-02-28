export default class Point {

	constructor (x, y) {
		Object.assign(this, {x, y, type: 'Point'});
	}


	clone (x, y) {
		return new Point(this.x + (x || 0), this.y + y || 0);
	}

}
