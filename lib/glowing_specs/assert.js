export default assert;


function assert (truthiness, message) {
    return {
        error: new Error(message),
        message,
        state: truthiness ? 'pass' : 'fail'
    };
}
