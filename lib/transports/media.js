export function loadImage (sourceUrl, configure) {
    var image = new Image();

    if (configure) {
        configure(image);
    }

    image.src = sourceUrl;

    return image;
};
