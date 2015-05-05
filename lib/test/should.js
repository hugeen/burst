export default function should (value) {
    if (!value) {
        fail(`Expected truthy but was: ${Object.toString(value)}`);
    }
};


export function fail (message) {
    throw new Error(message);
};
