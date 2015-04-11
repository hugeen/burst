export function loadImage (src, configure) {
    var image = new Image();

    if (configure) {
        configure(image);
    }

    image.src = src;

    return image;
};
