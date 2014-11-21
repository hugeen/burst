# Burst

Low level JavaScript Library to build your own Framework.


# Compatibility

* [Object.defineProperty](http://kangax.github.io/compat-table/es5/#Object.defineProperty)

## Use it with Browserify or NodeJS

```
$ npm install watchify -g
$ watchify main.js -o static/bundle.js -v --debug
```


## Core concepts and Phylosophy

* Convention over configuration.
* Performances are fine but not at the cost of other important concepts, such as readability.


## Capabilities

You can use capabilities this way.

```javascript
var myObject = {};
require('./capabilities/def.js')(myObject);
```

### Summary

* [Event](#event) - A Minimalist Publish/Subscribe Lib
* [Def](#def) - New way to define methods
* [Hook](#hook) - Trigger an event before and after a method is called
* [Tag](#tag) - To sort collections by tag
* [Model](#model) - Gluing

### Event

#### object.on(eventName, listener)

```javascript
function resize (size) {
    viewport.size = size;
};

viewport.on('resize', resize);
```

#### object.emit(eventName)

```javascript
viewport.emit('resize', { width: 100, height: 100 });
```

#### object.removeEventListener(eventName, listener)

```javascript
viewport.removeEventListener('resize', resize);
```

### Tag

#### collection.tag(tagName, object)

```javascript
collection.tag('enemies', orc);
collection.enemies => [orc]
```

#### collection.untag(tagName, object)

```javascript
collection.untag('enemies', orc);
collection.enemies; => []
```

### Def

#### object.def(methodName, method)

```javascript
object.def('attack', function(enemy) {
    enemy.life -= 10
});

object.attack(enemy);
```

#### object.hook(methodName)

```javascript
object.hook('attack');

object.on('before attack', function(enemy) {
    this.resetAttackCooldown();
});

object.on('after attack', function(enemy) {
    if (enemy.life < 0) {
        enemy.kill();
    }
});
```

### Model

#### Capabilities

* [Event](#event)
* [Def](#def)
* [Hook](#hook)
* [Tag](#tag)

#### Model.create(args);

```javascript
function User(params) {
    this.name = params.name;
}

User.on('before create', function(params) {
    params.name = params.name + ' Doe';
});

var john = User.create({
    this.name = 'John'
});
```

#### Usages

```javascript
// Can use def and hook on prototype

User.prototype.hook('setName', 'before');
User.prototype.def('setName', function(params) {
    this.name = params.name;
});

john.on('before setName', function(params) {
    params.name = params.name + ' Doe';
});

john.setName('John');
john.name; => John Doe


// Can use tags
User.tag('admin', john);
User.admin; => [john]
```