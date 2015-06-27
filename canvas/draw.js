export function drawImage (context, image, ...args) {
    context.drawImage(image, ...args);
};


export function drawText (context, text, ...args) {
    context.fillText(text, ...args);
};


export function clearRect (context, x, y, width, height) {
    context.clearRect(x, y, width, height);
};


export function clear (canvas) {

};
