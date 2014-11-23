# Burst

Low level JavaScript Library to build your own Framework.


# Compatibility
* IE 9+, Firefox 6+, Safari 5+, Chrome 6+, Opera 12+


## Use it with Browserify or NodeJS

```
$ npm install watchify -g
$ watchify main.js -o static/bundle.js -v --debug
```


## Core concepts and Phylosophy

* Convention over configuration.
* Performances are fine but not at the cost of other important concepts, such as readability.


## Core Capabilities

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


## DOM Library

A tiny jQuery-like Library

```javascript
// Selector
$('div'); => [div, div, div]
$(document) => [document]

// Add Event Listener
function onClick (e) {
    e.preventDefault();
}
$('a').on('click', onClick);

// Remove Event Listener
$('a').removeListner('click', onClick);

// DOM Ready
$(function() {}):
```

## Canvas Drawing

### Create a canvas

```javascript
var canvas = Canvas.create($('canvas')[0]);
```

### Draw a path

```javascript

// Create a Path
var path = Path.create();

// Add segments
path.add(
    Point.create(10, 10), // Starting point (x, y)
    Point.create(10, 100), // First segment (lineTo)
    Point.create(100, 100), // Second segment
    ...
);

```

#### Using curves

```javascript

// Point with 1 control points for Quadratic curve (x, y, [[cp1x, cp1y]])
Point.create(50, 25, [
    [75, 37]
]),


// Point with 2 control points for Bezier curve (x, y, [[cp1x, cp1y], [cp2x, cp2y]])
Point.create(50, 25, [
    [75, 37],
    [70, 25]
]),


// Example - Drawing a heart with bezier curves
path.add(
    Point.create(75, 40),
    Point.create(50, 25, [[75, 37],[70, 25]]),
    Point.create(20, 62.5, [[20, 25],[20, 62.5]]),
    Point.create(75, 120, [[20, 80],[40, 102]]),
    Point.create(130, 62.5, [[110, 102],[130, 80]]),
    Point.create(100, 25, [[130, 62.5],[130, 25]]),
    Point.create(75, 40, [[85, 25],[75, 37]])
);

```