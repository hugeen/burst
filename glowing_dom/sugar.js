import DomQuery from './dom_query';

export default function (a, parent) {
    return typeof a === 'function' ? onDomReady(a) : new DomQuery(a, parent);
}

function onDomReady (fnc) {
    return document.readyState === 'complete' ? fnc() : $(document).on('DOMContentLoaded', fnc);
}
