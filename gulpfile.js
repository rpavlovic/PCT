'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();


// paths
var sassSrc = 'src/sass/**/*.scss',
    sassDest = 'src/css';


//process scss files
gulp.task('styles', function() {
    gulp.src(sassSrc)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(sassDest))
      .pipe(browserSync.stream());
});

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('src/js/*js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('src/js'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

//browser synk and scss watch
gulp.task('serve', ['styles'], function() {
    browserSync.init({
        proxy: "localhost/weber/src/templates/"
    });
    gulp.watch("src/sass/**/*.scss",['styles']);
    gulp.watch("src/js/*.js", ['js-watch']);
    gulp.watch("src/templates/*.html").on('change', browserSync.reload);

});

gulp.task('default', ['serve']);