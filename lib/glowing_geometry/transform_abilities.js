import Vector2 from './vector2';

export default transformAbilities;


function transformAbilities (object = {}) {
    object.position = new Vector2;
    object.rotation = new Vector2;
    object.scale = new Vector2;
}
