import assert from 'core/assert';

export function failTimeout (done, delay, message) {
    return setTimeout(function () {
        done(assert(false, message));
    }, delay);
};
