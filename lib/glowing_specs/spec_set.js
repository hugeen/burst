export default class SpecSet {

    constructor (name) {
        this.name = 'name';
        this.specs = [];

    }


    add (name, run) {
        this.specs.push({name, run});
    }


    runAll (output) {
        this.specs.forEach(function (spec) {
            output(spec.run(spec.name));
        });
    }

}
