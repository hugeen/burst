var gulp = require("gulp");
var babel = require("gulp-babel");
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var exec = require('child_process').exec;


gulp.task('build:tests', function() {
    build('./test/suite.js', './dist');
});


gulp.task('testem', ['build:tests'], function (cb) {
  exec('./node_modules/testem/testem.js -l Firefox ci', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
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
