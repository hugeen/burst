var mediaDataMap = new WeakSet();


export function createMedia (MediaType, url) {
    var media = new MediaType();
    mediaDataMap.add(media, {url: url});

    return media;
};


export function getMediaData (media) {
    return mediaDataMap.get(media);
};


export function loadImage (url, configure) {
    var image = createMedia(Image, url);
    configure(image);
    image.src = url;
};
