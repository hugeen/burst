import eventAbilitiesSpecs from "specs/glowing_core/event_abilities.spec";


var specSets = [eventAbilitiesSpecs];


specSets.forEach(function (specSet) {
    console.group(specSet.name);
    specSet.runAll(output);
    console.groupEnd();
});


function output (spec) {
    if (spec.passed) {
        console.log(spec.infos.message);
    } else {
        console.error(spec.infos.stack);
    }
}
