export default class DomQuery extends Array {

	constructor (selector) {
		super();
		this.push(document.querySelectorAll(selector));
	}

	on (name, fnc) {
		this.forEach.call(this[0], function (el) {
			el.addEventListener(name, fnc);
		});
	}

	removeListener (name, fnc) {
		this.forEach.call(this[0], function (el) {
			el.removeEventListener(name, fnc);
		});
	}

}
