export default class Canvas {

	constructor (element) {
		this.element = element;
		this.context = element.getContext('2d');

        this.setSize();
	}


	clear () {
    	this.context.clearRect(0, 0, this.size.width, this.size.height);
	}


    setSize (size) {
        this.size = size || {
            width: this.element.width,
            height: this.element.height
        }
    }

}
