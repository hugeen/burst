module.exports = function (object) {

    if ('tag' in object) {
        return object;
    }


    var properties = {
        tags: {},
        tag: addToTag,
        untag: untag
    };

    for (var name in methods) {
        Object.defineProperty(object, name, {
            value: properties[name]
        });
    }


    return object;

};


function addToTag (name, entity) {

    var tag = findOrCreateTag.call(this, name);
    referenceTagName(name, entity);

    tag.push(entity);

    return this;
}


function untag (name, entity) {

    if (name in this.tags) {
        this.tags[name].splice(this.tags[name].indexOf(entity), 1);
        entity.taggedIn.splice(entity.taggedIn.indexOf(name), 1);
    }

    return this;
}


function findOrCreateTag (name) {

    if (!(name in this.tags)) {
        this.tags[name] = [];
        Object.defineProperty(this, name, {
            value: this.tags[name]
        });
    }

    return this.tags[name];

}


function referenceTagName (name, entity) {

    if (!('taggedIn' in entity)) {
        Object.defineProperty(entity, 'taggedIn', {
            value: []
        });
    }

    if (entity.taggedIn.indexOf(name) === -1) {
        entity.taggedIn.push(name);
    }

}
