import eventAbilitiesSpecs from "specs/glowing_core/event_abilities.spec";

console.group('Event Abilities');

eventAbilitiesSpecs.run(function (spec) {
    if (spec.passed) {
        console.log(spec.message);
    } else {
        console.error(spec.error.stack);
    }
});

console.groupEnd();

export default {};
