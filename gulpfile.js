'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();


// paths
var sassSrc = 'src/sass/**/*.scss',
    sassDest = 'build/css',
    jsSrc = 'src/js/*.js',
    jsDest = 'build/js';


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
    return gulp.src(jsSrc)
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
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
        proxy: "localhost/weber-shandwick/build/"
    });
    gulp.watch(sassSrc,['styles']);
    gulp.watch(jsSrc, ['js-watch']);
    gulp.watch("build/**/*.html").on('change', browserSync.reload);

});

gulp.task('default', ['serve']);