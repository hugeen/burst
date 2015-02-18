import AbstractInput from 'abstract_input/base';
import eventAbilities from 'core/event';

new AbstractInput();

var object = {
	hello: "world"
};
eventAbilities(object);

object.on('hello changed', function (change) {
	console.log(change)
});

// Which we then observe
Object.observe(object, function(changes){
	var observableChanges = changes.filter(function (change) {
		return ['hello'].indexOf(change.name) !== -1;
	});
    observableChanges.forEach(function(change, i){
    	object.emit(`${change.name} changed`, change);
  	});

});

object.hello = "2";

export default {};
