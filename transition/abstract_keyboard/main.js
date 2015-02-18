var eventCapabilities = require('../core/event');

var abstractKeyboard = eventCapabilities({});


window.addEventListener('keydown', function (e) {
    abstractKeyboard.emit('key pressed', e);
});


window.addEventListener('keydown', function (e) {
    abstractKeyboard.emit('key up', e);
});


module.exports = abstractKeyboard;
