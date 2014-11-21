var slice = Array.prototype.slice;

function eventCapabilities (object) {

    if (typeof object.on !== 'undefined') {
        return object;
    }


    Object.defineProperty(object, 'on', {
        value: function(identifier, fnc) {
            findOrCreateListeners.call(this);

            this.listeners[identifier] = this.listeners[identifier] || [];
            this.listeners[identifier].push(fnc);

            return this;
        }
    });


    Object.defineProperty(object, 'removeListener', {
        value: function(identifier, fnc) {
            findOrCreateListeners.call(this);

            if (identifier in this.listeners) {
                this.listeners[identifier].splice(this.listeners[identifier].indexOf(fnc), 1);
            }

            return this;
        }
    });


    Object.defineProperty(object, 'emit', {
        value: function(identifier, fnc) {
            findOrCreateListeners.call(this);

            if (identifier in this.listeners) {
                for (var i = 0; i < this.listeners[identifier].length; i++) {
                    this.listeners[identifier][i].apply(this, slice.call(arguments, 1));
                }
            }

            return this;
        }
    });


    return object;

}


function findOrCreateListeners() {
    if (!('listeners' in this)) {
        console.log('hello');
        Object.defineProperty(this, 'listeners', {
            value: {}
        });
    }
}


module.exports = eventCapabilities;
