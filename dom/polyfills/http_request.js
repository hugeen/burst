function httpRequestCapabilities(window) {

    if (!window.XMLHttpRequest && window.ActiveXObject) {
        window.XMLHttpRequest = HttpRequest;
    }

    return window;
}


function HttpRequest() {
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


module.exports = httpRequestCapabilities;
