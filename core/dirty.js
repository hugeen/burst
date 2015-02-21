export default dirtyAbilities;


function dirtyAbilities (object) {

    if ('observable' in object) {
        return object;
    }

    defineObservableAttrs(object);
    Object.observe(object, initObserver);

    object.observable = observable;
    object.notifyChange = notifyChange;

    return object;

}


function defineObservableAttrs (object) {
    Object.defineProperty(object, 'observableAttrs', {
        value: [],
        configurable: false,
        enumerable: false
    });
}


function initObserver (changes) {
    let filteredChanges = filterChanges(changes, this.observableAttrs);
    filteredChanges.forEach(this.notifiyChange);
}


function filterChanges (changes, attrs) {
	return changes.filter(function (change) {
		return attrs.indexOf(change.name) !== -1;
	});
}


function notifiyChange (change) {
	this.emit(`${change.name} changed`, change);
}


function observable (...attrs) {
	observableAttrs.concat(attrs);
}
