require('./capabilities/model.js')(User);

function User(params) {
    this.name = params.name;
}

User.on('before create', function(params) {
    params.name = 'Pierre';
});

var params = {
    name: 'Cyrille'
};

var u = User.create(params);

console.log(u);
