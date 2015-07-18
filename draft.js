//
// Concepts
//


// Stop using objects, they are fine, I've used them for years.
// But they are complex, mutating and expanding over the time.
// They are hard to maintain and track everything they can do.


// Object literals allowed to store data.
// To prevent mutation you can use destructuring
var position = { x: 0, y: 1 };
// You have now access to x and y;
// Same as var x = data.x; var y = data.y;
var {x, y} = data;

// To save states you can use Symbol associated to Map or WeakMap
var playerState = new WeakMap();
const $pos = Symbol.for('position');
playerState.set($pos, {x, y});

// Get player position
// Will return {x: 0, y: 1}
playerState.get($pos);

// Don't worry about memory while creating new objects this way
// Old objects will be thrown to garbage collector instantly



// Experiments

// var players = new WeakMap();

// function add (data) {
//     var {life} = data;

//     var $player = Symbol();
//     var data = new WeakMap();
//     data.set(Symbol.for('life'), life);
//     players.set($player, data);

//     emit(Player, 'added', $player);

//     return $player;
// }

// function takeDamages ($player, amount) {
//     var data = players.get($player);
//     var life = data.get(Symbol.for('life'));
//     data.set(Symbol.for('life'), life -= amount);
// }


// var $player = Player.add({life: 100});
// Player.takeDamages($player, 100);

// var $life = Symbol.for('life');
// var life = Player.getData($player, $life);





//
// API
//


// Event bus
on('my global event', myListener);
// Same as
on(Symbol.for('global'), 'my global event', myListener);
off('my global event', myListener);
emit('my global event', params);

// Object events
on(something, 'my event', myListener);
off(something, 'my event', myListener);
emit(something, 'my event', myListener);

// Build-in events
on(Keyboard, 'key press', myListener);
on(Device, 'tap', myListener);

// String find the associated symbol
on('keyboard', 'key press', myListener);
// Same as
on(Keyboard, 'key press', myListener);
// And
on(Symbol.for('keyboard'), 'key press', myListener);



// Dom utils
var myElements = Dom.get('div');
Dom.addClass(myElements, 'myClasse');
// Same as
Dom.addClass('div', 'myClasse');
Dom.on(myElements, 'click', myListener);
Dom.off(myElements, myListener);
Dom.append(myElements, otherElement);
Dom.prepend(myElements, otherElement);
Dom.remove(myElements);
Dom.show(myElements);
Dom.hide(myElements);
Dom.addClass(myElements, 'class-name');
Dom.hasClass(myElements, 'class-name');
Dom.toggleClass(myElements, 'class-name');
Dom.removeClass(myElements, 'class-name');



// Keyboard events
on(Keyboard, 'key press', myListener);
Keyboard.on('key press', myListener);
Keyboard.off('key press', myListener);
Keyboard.keyPressed('A');
Keyboard.comboPressed('shift', 'A');



// Mouse events
Mouse.on('click', myListener);
Mouse.on('double click', myListener);
Mouse.on('move', myListener);



// Device specific events
Device.on('orientation change', myListener);
Device.on('tap', myListener);
Device.on('double tap', myListener);
Device.on('swipe', myListener);
Device.on('pinch', myListener);
Device.on('drag', myListener);



// Gamepad utils
var gamepad = Gamepad.get('id');
Gamepad.activate(gamepad);
Gamepad.deactivate(gamepad);
Gamepad.getAxis(gamepad);
Gamepad.buttonPressed(gamepad, buttonCode);
Gamepad.comboPressed(gamepad, buttonCode1, buttonCode2);



// Ajax
Http.request('POST', url, data, options);
Http.get(url, options);
Http.post(url, options);



// Timer utils
on('animation frame', myListener);
Time.throttle(listener, time);
Time.delay(listener, time);
Time.repeat(listener, time);
Time.now();



// Tag
Tag.add(thing, 'myTag');
Tag.remove(thing, 'myTag');
Tag.is(thing, 'myTag');
on(thing, 'tagged', myListener);
on(thing, 'untagged', myListener);
// Broadcast an event to all tagged objects
Tag.broadcast('myTag', 'thing happens', myListener);
on(thing, 'thing happens', myListener);



// Asset loader
Asset.load('image.png', myListener);
Asset.get('image.png');
Asset.store('image.png');



// LocalStorage accessing tools
Storage.set('key', myObject);
Storage.get('key');



// IndexedDb accessing tools
Database.get('name');
Database.createTable(database, 'name');
Database.getTable(database, 'name');
Database.index(table, 'id', options);
Database.find(table, id);
Database.add(table, myObject);
Database.remove(table, id);



// Parallelization
Worker.spawn(myFunction);
Worker.destroy(worker);



// Image, Audio, Video
Media.get(asset);
Media.play(media);
Media.pause(media);
Media.stop(media);
Media.changeVolume(media, 1);
Media.getVolume(media);



// Tween
Tween.register('easeInOut', easeInOut);
var tween = Tween.start(startValues, endValues, 'easeInOut');
Tween.stop(tween);



// Template
Template.compile(template, values);



// Generic Queueing system
Queue.start(myFunctions, parallelizePer);
Queue.stop(queue);
on(queue, 'progress', myListener);
on(queue, 'complete', myListener);
on(queue, 'stop', myListener);



// Drawing tools - should be detached from burst
var myScreen = Screen.add(element);
Screen.clear(myScreen, params);
Screen.drawImage(myScreen, image, params);
Screen.drawPixel(myScreen, pixel, params);
Screen.drawRectangle(myScreen, rectange, params);
Screen.drawCircle(myScreen, arc, params);
Screen.drawPolygon(myScreen, polygon, params);
Screen.drawPath(myScreen, path, params);
Screen.forEachPixel(myScreen, myIterator);
Screen.toUrl(myScreen);

// Separated helpers
Path, Rectangle, Arc, Polygon, Coord, Vector, Vector3



// Style can be applied on renderers
on(style, 'change', myListener);
Style.set('identifier', params);
Style.get('identifier');
