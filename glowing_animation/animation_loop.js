export default function (callback) {
    return new AnimationLoop(callback).resume();
}


export class AnimationLoop {

    constructor (callback) {
        this.callback = callback;
    }

    stop () {
        this.running = false;
        cancelAnimationFrame(this.id);

        return this;
    }

    resume () {
        this.lastTime = false;
        this.running = true;
        AnimationLoop.enterFrame(this);

        return this;
    }

    static enterFrame(handler) {
        handler.id = requestAnimationFrame(function (time) {
            if (handler.running) {
                var dt = !handler.lastTime ? 0 : time - handler.lastTime;
                handler.lastTime = time;

                handler.callback(dt, handler);
                AnimationLoop.enterFrame(handler);
            } else {
                handler.stop();
            }
        });
    }

}
