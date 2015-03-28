export default function (a, parent) {
    return typeof a === 'function' ? onDomReady(a) : new DomQuery(a, parent);
}


function onDomReady (fnc) {
    return document.readyState === 'complete' ? fnc() : $(document).on('DOMContentLoaded', fnc);
}


export class DomQuery extends Array {

	constructor (selector, parent) {
		var elements = DomQuery.isElement(selector) ? [selector] : DomQuery.getElements(selector, parent);
		this.push.apply(this, elements);
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


	static isElement (element) {
		return element && element.nodeType;
	}


	static getElements (selector, parent) {
		return (parent || document).querySelectorAll(selector || null);
	}

}

