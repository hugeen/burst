export default class Vector2 {

    constructor (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }


    fromArray (src) {
        return new Vector2(src[0], src[1]);
    }


    fromObject (src) {
        return new Vector2(src.x, src.y);
    }


    clone () {
        return new Vector2(this.x, this.y);
    }


    plus (vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }


    minus (vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }


    multiply (number) {
        return new Vector2(this.x * number, this.y * number);
    }


    length () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }


    normalize () {
        return this.multiply(1 / this.length());
    }


    rotate90 () {
        return new Vector2(-this.y, this.x);
    }


    dot (vector) {
        return this.x * vector.x + this.y * vector.y;
    }


    project (vector) {
        return vector.multiply(this.dotProduct(vector));
    }


    invert () {
        return new Vector2(this.y * -1, this.x * -1);
    }

}
