module.exports = function (HttpRequest) {

    HttpRequest.on('new', function(httpRequest) {
        for (var key in settings) {
            httpRequest[key] = settings[key];
        }
    });

    return HttpRequest;
};
