export default class DomQuery extends Array {

	constructor (selector, parent) {
		this.push.apply(this, DomQuery.isElement(selector) ? [selector] : DomQuery.getElements(selector, parent));
	}

	on (name, fnc) {
		this.forEach(el => el.addEventListener(name, fnc));

		return this;
	}

	removeListener (name, fnc) {
		this.forEach(el => el.removeEventListener(name, fnc));

		return this;
	}

	find (selector) {
		var domQuery = new DomQuery();

		this.forEach(function (element) {
			var children = new DomQuery(selector, element);
			domQuery.push.apply(domQuery, children);
		});

		return domQuery;
	}

	first () {
		return new DomQuery(this[0]);
	}

	last () {
		return new DomQuery(this[this.length - 1]);
	}

	static isElement (element) {
		return element && element.nodeType;
	}

	static getElements (selector, parent) {
		return (parent || document).querySelectorAll(selector || null);
	}

}

