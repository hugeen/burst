import Vector2 from './vector2'


export default class Transform {

    constructor (x, y) {
        this.position = new Vector2;
        this.rotation = new Vector2;
        this.scale = new Vector2;
    }

}
