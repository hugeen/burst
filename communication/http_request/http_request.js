var slice = Array.prototype.slice;
var eventCapabilities = require('../core/event');

require('../dom/polyfills/http_request')(window);


function HttpRequest (settings) {
    eventCapabilities(this);

    defineXhr(this);
    defineSettings(this, settings);

    this.open();
}


HttpRequest.prototype.open = function () {
    this.xhr.open(this.method, this.url, true);
};


HttpRequest.prototype.send = function () {
    this.xhr.send();
    this.emit('sent');
};


HttpRequest.prototype.proxifyEvent = function (identifier, proxyIdentifier) {
    var proxy = eventProxy(this, proxyIdentifier || identifier);
    this.xhr.addEventListener(identifier, proxy, false);
};


function defineXHR (handler) {
    handler.xhr = new XMLHttpRequest();
    handler.proxifyEvent('progress');
    handler.proxifyEvent('load', 'completed');
    handler.proxifyEvent('error', 'failure');
    handler.proxifyEvent('aborted');
}


function eventProxy (handler, identifier) {
    return function () {
        handler.emit.apply(identifier, slice.call(arguments));
    };
}


function defineSettings (handler, settings) {
    for (var key in settings) {
        handler[key] = settings[key];
    }
}


module.exports = HttpRequest;
