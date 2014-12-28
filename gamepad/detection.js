module.exports = function (Gamepad) {

    window.addEventListener('gamepadconnected', function (e) {
        Gamepad.emit('connected', e.gamepad);
    });


    window.addEventListener('gamepaddisconnected', function (e) {
        Gamepad.emit('disconnected', e.gamepad);
    });

    return Gamepad;

};
