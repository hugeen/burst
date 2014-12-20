require('../dom/polyfills/http_request')(window);
var eventCapabilities = require('../core/event');


eventCapabilities(HttpRequest);
require('./settings')(HttpRequest);
require('./events')(HttpRequest);


function HttpRequest (settings) {
    eventCapabilities(this);

    this.xhr = new XMLHttpRequest();
    HttpRequest.emit(HttpRequest, 'new', settings);

    this.open();
}


HttpRequest.prototype.open = function () {
    this.xhr.open(this.method, this.url, true);
};


HttpRequest.prototype.send = function () {
    this.xhr.send();
    this.emit('sent');
};


module.exports = HttpRequest;
