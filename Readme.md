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
import eventAbilities from 'glowing_core/event';

// Provite event abilities to your object
var object = {};
eventAbilities(object);

// Subscribe to an event
object.on('event name', function () {
	// This function will be called when the event is triggered
});

// Trigger event
object.emit('event name');
```

#### Dirty Tracking

```javascript
import dirtyAbilities from 'glowing_core/dirty';

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

## Development notes

Thanks to [JSPM](http://jspm.io/), it's now possible to use ES6.

So I start refactoring (once again).
For that new start I just want to keep things simple (No overpowered features).

Note : To avoid name collisions with future modules, I now prefix each basic module with "glowing" (In reference to Burst).
