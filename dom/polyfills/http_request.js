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


function tryActiveX (version, failure) {
    var httpRequest = null;

    try {
        httpRequest = new ActiveXObject(version);
    } catch (e) {
        httpRequest = failure();
    }

    return httpRequest;
}


module.exports = httpRequestCapabilities;
