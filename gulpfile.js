var gulp = require("gulp");
var babel = require("gulp-babel");
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task("default", function () {
    gulp.watch('arrowFunctions.js', ['build']);
});


gulp.task('build:app', function() {
    browserify({
        entries: './src/app.js',
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('src/app.js'))
    .pipe(gulp.dest('./dist'));
});



gulp.task('build:specs', function() {
    build('./specs/test_mocha.js', './dist')
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
