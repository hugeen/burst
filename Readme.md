# Burst

## How and Why ?

I am looking for new way to develop tools and applications more efficiently. From prototype to production.

My will is to provide a framework and conventions that will allow developers to access high-level features, quickly and without pain.

## For who ?

- App and Web developers
- Game developers
- Tool developers
- Experts and beginners

## Framework

### Core

#### Event (Publish / Subscribe)

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

#### Dirty Tracking

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

### DOM - jQuery Like Utility

```javascript
import $ from 'glowing_dom/sugar';

$('div');
$('body').find('div');

$('a').on('click', function (e) {
	e.preventDefault();
});
```

### Animation Loop - requestAnimationFrame sugar

```javascript
import loop from 'glowing_loop/sugar';

loop(function (deltaTime, handler) {
	// Stop
	handler.stop();

	// Resume
	handler.resume();
});
```

### HttpRequest

```javascript
import HttpRequest from 'glowing_http/http_request';

var http = new HttpRequest({ method: 'get' });
```

## Development notes

Thanks to [JSPM](http://jspm.io/), it's now possible to use ES6.

So I start refactoring (once again).
For that new start I just want to keep things simple (No overpowered features).

Note : To avoid name collisions with future modules, I now prefix each basic module with "glowing" (In reference to Burst).
