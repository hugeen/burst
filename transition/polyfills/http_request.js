module.exports = function (object) {

    if (!object.XMLHttpRequest && object.ActiveXObject) {
        object.XMLHttpRequest = ActiveXRequest;
    }

    return object;
};


function ActiveXRequest() {
    return tryActiveX('Msxml2.XMLHTTP', function () {
        tryActiveX('Microsoft.XMLHTTP');
    });
}


function tryActiveX (version, onFailure) {
    var httpRequest = null;

    try {
        httpRequest = new ActiveXObject(version);
    } catch (e) {
        if (typeof onFailure === 'function') {
            httpRequest = onFailure();
        }
    }

    return httpRequest;
}
