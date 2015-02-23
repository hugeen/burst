export default class DomQuery extends Array {

	constructor (selector) {
		this.push.apply(this, document.querySelectorAll(selector));
	}

	on (name, fnc) {
		this.forEach(el => el.addEventListener(name, fnc));
	}

	removeListener (name, fnc) {
		this.forEach(el => el.removeEventListener(name, fnc));
	}

}
