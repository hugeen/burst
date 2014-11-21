# Burst

Low level JavaScript Library to build your own Framework.


---

## Use it with Browserify and NodeJS

$ npm install watchify -g
$ watchify main.js -o static/bundle.js -v --debug


---

## Core concepts and Phylosophy

* Convention over configuration.

* Performances are fine but not at the cost of other important concepts, such as readability.


---

## Features

### Event

#### object.on(eventName, listener)

function resize (size) {
    viewport.size = size;
};

viewport.on('resize', resize);

#### object.emit(eventName)

viewport.emit('resize', { width: 100, height: 100 });

#### object.removeEventListener(eventName, listener)

viewport.removeEventListener('resize', resize);


### Tag

#### collection.tag(tagName, object)

collection.tag('enemies', orc);
collection.enemies => [orc]

#### collection.untag(tagName, object)

collection.untag('enemies', orc);
collection.enemies; => []


### Def

#### object.def(methodName, method)

object.def('attack', function(enemy) {
    enemy.life -= 10
});

object.attack(enemy);

#### object.hook(methodName)

object.hook('attack');

object.on('before attack', function(enemy) {
    this.resetAttackCooldown();
});

object.on('after attack', function(enemy) {
    if (enemy.life < 0) {
        enemy.kill();
    }
});


### Model

#### Capabilities

* Event
* Def
* Hook
* Tag

#### Model.create(args);

function User(params) {
    this.name = params.name;
}

User.on('before create', function(params) {
    params.name = params.name + ' Doe';
});

var john = User.create({
    this.name = 'John'
});


#### Usages

// Can use def and hook on prototype

User.prototype.hook('setName', 'before');
User.prototype.def('setName', function(params) {
    this.name = params.name;
});

john.on('before setName', function(params) {
    params.name = params.name + ' Doe';
})

john.setName('John');

john.name; => John Doe


// Can use tags

User.tag('admin', john);

User.admin; => [john]