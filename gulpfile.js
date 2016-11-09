'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    compile = require('gulp-jqtmpl'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    flatten = require('gulp-flatten');

// paths
var sassSrc = 'src/sass/**/*.scss',
    sassDest = 'build/css',
    jsSrc = 'src/js/**/*.js',
    jsDest = 'build/js',
    htmlSrc = 'src/templates/**/*.nunjucks',
    htmlDest = 'build/templates',
    defaults = {
      path: ['src/templates'],
    };


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

gulp.task('nunjucks', function () {
  // Gets .html and .nunjucks files in pages
 return gulp.src('src/templates/**/*.+(html|nunjucks)')
    // Renders template with nunjucks
    .pipe(nunjucksRender(defaults))
    // .pipe(data(function() {
    //      return require('./src/data/gw_client_data.json')
    //    }))
    // output files in app folder
    .pipe(gulp.dest('build/templates'))
});


// create a task that ensures the `nunchucks` task is complete before
// reloading browsers
gulp.task('nunjucks-watch', ['nunjucks'], function (done) {
    browserSync.reload();
    done();
});
// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

//browser synk and scss,js and nunjucks watch
gulp.task('serve', ['styles', 'js-watch', 'nunjucks-watch'], function() {
    browserSync.init({
      server: {
          baseDir: "build",
          index: "/templates/pages/index.html"
      }
    });
    gulp.watch(sassSrc,['styles']);
    gulp.watch(jsSrc, ['js']);
    gulp.watch(htmlSrc, ['nunjucks']).on('change', browserSync.reload);
});


gulp.task('default', ['serve']);
