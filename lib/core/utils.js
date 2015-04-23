export function getParamNames (fnc) {
    var string = fnc.toString();
    var names = string.match(/\(.*?\)/)[0].replace(/[()]/gi,'').replace(/\s/gi,'');

    return names === '' ? [] : names.split(',');
};
