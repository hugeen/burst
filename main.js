require('./capabilities/model.js')(User);

function User(params) {
    this.name = params.name;
}

User.prototype.hook('bitch');
User.prototype.def('bitch', function() {
    console.log(this, 'bitch');
});

var params = {
    name: 'Cyrille'
};

var v = User.create(params);

v.on('before bitch', function() {
    console.log('before bitch', this);
});

v.bitch();

User.tag('roxxor', v);
User.untag('roxxor', v);

console.log(User.roxxor);