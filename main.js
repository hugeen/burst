require('./capabilities/extend.js')(Object.prototype);
require('./capabilities/clone.js')(Object.prototype);


var M = {};
require('./capabilities/event.js')(M);
require('./capabilities/def.js')(M);

M.hook('hello');

M.def('hello', 'enumerable', function() {
    console.log('world');
});

M.on('before hello', function() {
    console.log('before', arguments);
});

M.on('after hello', function() {
    console.log('after', arguments);
});

M.hello();