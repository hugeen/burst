export default assert;


function assert (truthiness, message) {

    return {
        infos: new Error(message),
        passed: !!truthiness
    };

}
