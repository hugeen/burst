module.exports = function(KeyboardManager) {

    window.addEventListener('keydown', function (e) {
        KeyboardManager.invoke('emit', 'key pressed', e);
    });


    window.addEventListener('keydown', function (e) {
        KeyboardManager.invoke('emit', 'key up', e);
    });

    return KeyboardManager;

};
