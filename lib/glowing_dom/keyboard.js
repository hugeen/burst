import eventAbilities from 'glowing_core/event_abilities';
import {addEventProxy} from 'glowing_core/event_utils';
import $ from 'glowing_dom/dom_query';


var keyboard = eventAbilities();
var $document = $(document);


$document.on('keypress', function (e) {
    keyboard.emit(e.repeat ? 'key down' : 'key pressed', e);
});


addEventProxy($document, keyboard, 'keyup', 'key released');


export default keyboard;
