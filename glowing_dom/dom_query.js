export default class DomQuery extends Array {

	constructor (selector, parent) {

		this.push.apply(this, (function () {
			var isElement = selector && selector.nodeType;
			return isElement ? [selector] : (parent || document).querySelectorAll(selector);
		})());

	}

	on (name, fnc) {
		this.forEach(el => el.addEventListener(name, fnc));
	}

	removeListener (name, fnc) {
		this.forEach(el => el.removeEventListener(name, fnc));
	}

	first () {
		return new DomQuery(this[0]);
	}

	last () {
		return new DomQuery(this[this.length - 1]);
	}

}

