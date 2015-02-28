# Burst

I am looking for new way to develop tools and applications more efficiently. From prototype to production.

My will is to provide a framework and conventions that will allow developers to access high-level features, quickly and without pain.

## Target

- App and Web developers
- Game developers
- Tool developers
- Experts and beginners

## Framework

### Core

#### Event Abilities

```javascript
// Event Abilities
import eventAbilities from 'glowing_core/event_abilities';

// Provite event abilities to your object
var object = {};
eventAbilities(object);

// Subscribe to an event
object.on('event name', function () {
	// This function will be called when the event is triggered
});

// Trigger event
object.emit('event name');


// Event Utils
import * from 'glowing_core/event_utils';

// Add event proxy
var proxy = addEventProxy(object2, object1, 'event name');

object1.on('event name', function () {
	// This function will be called after object2.emit('event name');
});

// Remove event proxy
removeEventProxy(object2, 'event name', proxy);

// Advanced event proxy
// Forward and rename click event from document to object 1
addEventProxy([document, 'addEventListener'], object1, 'click', 'page clicked');
```

#### Dirty Tracking Abilities

```javascript
import dirtyAbilities from 'glowing_core/dirty_abilities';

// Provite dirty tracking abilities to your object
var object = {
	hello: 1
};
dirtyAbilities(object);

// You can now set a property as observable
dirty.observable('hello');

// Subscribe to the property changed event
object.on('hello changed', function (change) {
	// You can access to the old value on change
	console.log(this.hello, change.oldValue);
});

// This will trigger the 'hello changed' event
object.hello = 2;
```

### DOM

#### DomQuery - jQuery Like

```javascript
import $ from 'glowing_dom/dom_query';

$('div');
$('body').find('div');

$('a').on('click', function (e) {
	e.preventDefault();
});
```

#### Keyboard

```javascript
import keyboard from 'glowing_dom/keyboard';

// Triggered on key pressed
keyboard.on('key pressed', function() {});

// Triggered repeatedly on key down
keyboard.on('key down', function() {});

// Triggered on key released
keyboard.on('key released', function() {});
```

### Animation

#### requestAnimationFrame

```javascript
import animLoop from 'glowing_loop/animation_loop';

animLoop(function (deltaTime, handler) {
	// Stop
	handler.stop();

	// Resume
	handler.resume();
});
```

### Transports

#### HttpRequest

```javascript
import HttpRequest from 'glowing_transports/http_request';

var http = new HttpRequest({ method: 'get' });
```

### Renderers

#### Canvas

```javascript
import Canvas from 'glowing_renderers/canvas';

// New canvas
var canvas = new Canvas(element);

// Clear canvas
canvas.clear();

// Draw a path
canvas.drawPath(path);
```

### Geometry

#### Point

```javascript
import Point from 'glowing_geometry/point';

// New point
var point = new Point(0, 0); // x, y

// Clone point
point.clone();
```

#### Path

```javascript
import Path from 'glowing_geometry/path';

// New path
var path = new Path();

// Append path
path.push(point);
```
