'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten');

// paths
var sassSrc = 'src/sass/**/*.scss',
    sassDest = 'build/css',
    jsSrc = 'src/js/**/*.js',
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
      .pipe(uglify()
        .on('error', function(e) {
           console.log(e);
        })
      )
      .pipe(flatten())
      .pipe(concat('base.js'))
      .pipe(gulp.dest(jsDest));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

//browser synk and scss watch
gulp.task('serve', ['styles', 'js-watch'], function() {
    browserSync.init({
        proxy: "localhost/weber-shandwick/build/"
    });
    gulp.watch(sassSrc,['styles']);
    gulp.watch(jsSrc, ['js']);
    gulp.watch("build/**/*.html").on('change', browserSync.reload);

});

gulp.task('default', ['serve']);
