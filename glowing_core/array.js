export default arrayAbilities;

function arrayAbilities (object) {

    if ('length' in object && 'splice' in object) {
        return object;
    }

    Object.defineProperty(object, 'length', {
        value: 0,
        writable: true
    });

    object.splice = [].splice;
    object.remove = remove;
    object.each = each;
    object.push = push;

    return object;
}


function each (iterator, value) {
    [].forEach.call(this, iterator, value);
}


function push () {
    [].push.apply(this, [].slice.call(arguments));
}


function remove (thing) {
    var index = this.indexOf(thing);

    if (index !== -1) {
        this.splice(index, 1);
    }
}
