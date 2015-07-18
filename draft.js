// Event bus
on('my global event', myListener);
off('my global event', myListener);
emit('my global event', params);

// Object events
on(something, 'my event', myListener);
off(something, 'my event', myListener);
emit(something, 'my event', myListener);

// Build-in events
on(Keyboard, 'key pressed', myListener);
on(Device, 'tap', myListener);

// String find the associated symbol
on('keyboard', 'key press', myListener);
// Same as
on(Keyboard, 'key press', myListener);
// And
on(Symbol.for('keyboa'), 'key pressed', myListener);



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
Tag.add(myObject, 'myTag');
Tag.remove(myObject, 'myTag');
Tag.is(myObject, 'myTag');
on(myObject, 'tagged', myListener);
on(myObject, 'untagged', myListener);



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
Tween.start(myObject, values, 'easeInOut');
Tween.stop(tween);



// Template
Template.compile(template, values);



// Generic Queueing system
Queue.start(myFunctions, parallelizePer);
Queue.stop(queue);
on(queue, 'progress', myListener);
on(queue, 'complete', myListener);
on(queue, 'stop', myListener);



// Canvas drawing tools
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
