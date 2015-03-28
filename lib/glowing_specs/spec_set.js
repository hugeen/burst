export default class SpecSet {

    constructor (name) {
        this.name = 'name';
        this.specs = [];

    }


    add (fnc) {
        this.specs.push(fnc);
    }


    run (fnc) {
        this.specs.forEach(function (spec) {
            fnc(spec());
        });
    }

}
