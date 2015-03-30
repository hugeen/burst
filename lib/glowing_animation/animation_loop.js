export default class AnimationLoop {

    constructor (callback) {
        this.callback = callback || function () {};
        this.animationFrame = null;
        this.lastTime = null;
        this.running = null;
    }


    stop () {
        this.running = false;
        this.lastTime = null;
        cancelAnimationFrame(this.animationFrame);
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
