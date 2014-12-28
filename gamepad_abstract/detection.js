module.exports = function (GamepadAbstract) {

    window.addEventListener('gamepadconnected', function (e) {
        GamepadAbstract.emit('gamepad connected', e.gamepad);
    });


    window.addEventListener('gamepaddisconnected', function (e) {
        GamepadAbstract.emit('gamepad disconnected', e.gamepad);
    });

    return GamepadAbstract;

};
