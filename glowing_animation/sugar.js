import AnimationLoop from './animation_loop';

export default function (callback) {
	return new AnimationLoop(callback).resume();
}
