module.exports = function (HttpRequest) {

    HttpRequest.on('new', function(httpRequest) {
        proxifyEvent(httpRequest, 'progress');
        proxifyEvent(httpRequest, 'load', 'completed');
        proxifyEvent(httpRequest, 'error', 'failure');
        proxifyEvent(httpRequest, 'aborted');
    });

    return HttpRequest;
};


function proxifyEvent (handler, identifier, proxyIdentifier) {
    var proxy = eventProxy(handler, proxyIdentifier || identifier);
    handler.xhr.addEventListener(identifier, proxy, false);
}


function eventProxy (handler, identifier) {
    return function () {
        handler.emit.apply(identifier, slice.call(arguments));
    };
}

