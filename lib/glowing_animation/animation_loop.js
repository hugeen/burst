export default function (callback) {
    return new AnimationLoop(callback).resume();
}


export class AnimationLoop {

    constructor () {
        this.callback = callback;
        this.animationFrame = null;
        this.lastTime = null;
    }


    stop () {
        this.running = false;
        this.lastTime = null;
        cancelAnimationFrame(this.id);
    }


    resume () {
        this.running = true;
        this.animationFrame = requestAnimationFrame(this.enterFrame.bind(this));
    }


    enterFrame (time) {
        if (this.running) {
            this.deltaTime = !this.lastTime ? 0 : time - this.lastTime;
            this.lastTime = time;
            this.callback(this.deltaTime, this);
            this.resume();
        }
    }

}
