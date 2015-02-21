export default dirtyAbilities;


function dirtyAbilities (object) {

    if ('observable' in object) {
        return object;
    }

    defineObservableAttrs(object);
    initObserver(object);

    object.observable = observable;

    return object;

}


function defineObservableAttrs (object) {
    Object.defineProperty(object, 'observableAttrs', {
        value: [],
        configurable: false,
        enumerable: false
    });
}


function initObserver (rawChanges) {
	let attrs = this.observableAttrs;

    let changes = rawChanges.filter(function (change) {
		return attrs.indexOf(change.name) !== -1;
	});

    changes.forEach(function(change, i){
    	this.emit(`${change.name} changed`, change);
  	}.bind(this));
}


function observable (...attrs) {
	observableAttrs.concat(attrs);
}

