export default class Path extends Array {

	constructor (segments = []) {
		this.type = 'path';
		this.push.apply(this, segments);
	}

}
