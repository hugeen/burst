var sharedProperties = ['axes', 'buttons', 'id', 'mapping', 'timestamp'];


module.exports = function (GamepadAbstract) {

    window.addEventListener('gamepadconnected', function (e) {
        var gamepad = new GamepadAbstract();
        proxifyProperty(e.gamepad, gamepad, sharedProperties);
    });


    window.addEventListener('gamepaddisconnected', function (e) {
        var gamepad = GamepadAbstract.find(e.gamepad.id);
        GamepadAbstract.remove(gamepad);
    });

    return GamepadAbstract;

};


function proxifyProperties (source, destination, properties) {
    for (var i = 0; i < properties.length; i ++) {
        proxifyProperty(source, destination, properties[i]);
    }
}


function proxifyProperty (source, destination, property) {
    Object.defineProperty(destination, property, {
        enumerable: true,
        get: function () {
            return source[property];
        }
    });
}
