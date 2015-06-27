var mediaDataMap = new WeakSet();


export function createMedia (MediaType, url) {
    var media = new MediaType();
    mediaDataMap.set(media, {url: url});
};


export function loadMedia () {

};


export function getMediaData (media) {
    return mediaDataMap.get(media);
};


export function loadImage (image, configure) {
    configure(image);
    image.src = sourceUrl;
};


// createMedia(Image, '/erer.js');

// var queue = buildQueue(function (add) {
//     add(function (done) {
//         done();
//     });
// });


// loadAssets(function (addToLoader) {
//     addToLoader(Image, '/hello.png');
//     addToLoader(Video, '/vid.jpg');
// })

// processQueue(function (addToQueue) {
//     addToQueue(function (done) {
//         loadImage('/hello.png', function (image) {
//             on(image, 'load', done);
//         });
//     });

//     addToQueue(function (done) {
//         loadImage('/yo.png', function (image) {
//             on(image, 'load', done);
//         });
//     });
// });
