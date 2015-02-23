export default class DomQuery {
	constructor (selector) {
		this.query = document.querySelectorAll(selector);
	}
}
