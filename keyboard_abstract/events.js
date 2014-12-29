module.exports = function(KeyboardAbstract) {

    window.addEventListener('keydown', function (e) {
        KeyboardAbstract.all.invoke('emit', 'key pressed', e);
    });


    window.addEventListener('keydown', function (e) {
        KeyboardAbstract.all.invoke('emit', 'key up', e);
    });

    return KeyboardAbstract;

};
