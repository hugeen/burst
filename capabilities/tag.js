module.exports = function(object) {

    var tags = {};


    Object.defineProperty(object, 'tag', {
        value: function (name, entity) {

            createTag(tags);
            referenceTag(name, entity);

            tags[name].push(entity);

            return this;
        }
    });


    return object;

};


function createTag (tags) {

    if (typeof tags[name] === 'undefined') {
        tags[name] = [];
    }

}


function referenceTag (name, entity) {

    if (typeof entity.taggedIn === 'undefined') {
        Object.defineProperty(entity, 'taggedIn', {
            value: []
        });
    }

    if (entity.taggedIn.indexOf(name) === -1) {
        entity.taggedIn.push(name);
    }

}
