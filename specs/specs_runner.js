import eventAbilitiesSpecs from "specs/glowing_core/event_abilities.spec";


var specSets = [
    {name: 'Event Abilities', set: eventAbilitiesSpecs}
];


specSets.forEach(function (specSet) {
    console.group(specSet.name);
    specSet.set.run(run);
    console.groupEnd();
});


function run (spec) {
    if (spec.passed) {
        console.log(spec.message);
    } else {
        console.error(spec.error.stack);
    }
}
