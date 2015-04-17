var keys = {
    '⇧': 16, shift: 16,
    '⌥': 18, alt: 18, option: 18,
    '⌃': 17, ctrl: 17, control: 17,
    '⌘': 91, command: 91,
    backspace: 8, tab: 9, clear: 12,
    enter: 13, 'return': 13, del: 46, 'delete': 46,
    esc: 27, escape: 27, space: 32,
    left: 37, up: 38, right: 39, down: 40,
    home: 36, end: 35, pageup: 33, pagedown: 34,
    ',': 188, '.': 190, '/': 191,
    '`': 192, '-': 189, '=': 187,
    ';': 186, '\'': 222,
    '[': 219, ']': 221, '\\': 220
};


for (let i = 1; i < 20; i++) {
    keys['f' + i] = 111 + i;
}


export default keys;
