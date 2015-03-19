import eventAbilities from '../glowing_core/event_abilities';
import {addEventProxy} from '../glowing_core/event_utils';

export default class HttpRequest {

    constructor (settings) {

        eventAbilities(this);
        Object.assign(this, settings);

        this.xhr = new XMLHttpRequest();
        this.proxifyEvents([
            ['progress'],
            ['load', 'loaded'],
            ['error', 'failure'],
            ['aborted']
        ]);

        this.open();

    }


    open () {
        this.xhr.open(this.method, this.url, true);
    }


    send () {
        this.xhr.send();
    }


    proxifyEvents (identifiers) {
        for (var identifier of identifiers) {
            addEventProxy([this.xhr, 'addEventListener'], this, ...identifier);
        }
    }

}
