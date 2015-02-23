import eventAbilities from './event';

export default dirtyAbilities;


function dirtyAbilities (object) {

    if ('observable' in object) {
        return object;
    }

    eventAbilities(object);
    defineObservableAttrs(object);
    Object.observe(object, observe.bind(object));

    object.observable = observable;
    object.notifyChange = notifyChange;

    return object;

}


function defineObservableAttrs (object) {
    Object.defineProperty(object, 'observableAttrs', {
        value: [],
        writable: true
    });
}


function filterChanges (changes, attrs) {
	return changes.filter(function (change) {
		return attrs.indexOf(change.name) !== -1;
	});
}


function observe (changes) {
    var filteredChanges = filterChanges(changes, this.observableAttrs);
    filteredChanges.forEach(notifyChange.bind(this));
}


function observable (...attrs) {
	this.observableAttrs = this.observableAttrs.concat(attrs);
}


function notifyChange (change) {
    this.emit(`${change.name} changed`, change);
}
