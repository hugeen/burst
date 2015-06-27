var gulp = require("gulp");
var babel = require("gulp-babel");
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var exec = require('child_process').exec;
var notifier = require('node-notifier');


gulp.task('default', function () {
    gulp.watch('./test/*/*.js', ['testem']);
});


gulp.task('build:tests', function() {
    build('./test/suite.js', './dist');
});


gulp.task('testem', ['build:tests'], function (cb) {
  exec('./node_modules/testem/testem.js -g -l Firefox ci', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if(err) {
        notifier.notify({title: 'Burst test suite failed', message: stdout, sound: 'Sosumi'});
    }
    cb(err);
  });
});


function build (entry, dest) {
    browserify({
        entries: entry,
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source(entry))
    .pipe(gulp.dest(dest));
}
