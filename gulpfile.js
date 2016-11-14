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
    htmlSrc = 'src/templates/**/*.njk',
    htmlDest = 'build/templates',
    defaults = {
      path: ['src/templates'],
    };

// Fonts
gulp.task('fonts', function() {
  return gulp.src(['src/fonts/**/*.{eot,svg,ttf,woff,woff2}'])
  .pipe(gulp.dest('build/fonts/'));
});

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
 return gulp.src('src/templates/**/*.+(html|njk)')
    // Renders template with nunjucks
    .pipe(nunjucksRender(defaults))
    // .pipe(data(function() {
    //      return require('./src/data/gw_client_data.json')
    //    }))
    // output files in app folder
    .pipe(gulp.dest('build/templates'))
    .pipe(browserSync.stream({once: true}));
});

// Data
gulp.task('data', function () {
  return gulp.src([
    'src/data/**/*.csv',
    'src/data/**/*.json'])
  .pipe(gulp.dest('build/data'));
});

// create a task that ensures the `nunchucks` task is complete before
// reloading browsers can be added to the task serve
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
gulp.task('serve', ['styles', 'js-watch'], function() {
    browserSync.init({
      server: {
          baseDir: "./build",
          index: "templates/pages/index.htm"
      }
    });
    gulp.watch(sassSrc,['styles']);
    gulp.watch(jsSrc, ['js']);
    gulp.watch(htmlSrc, ['nunjucks']).on('change', browserSync.reload);
});

// Build
gulp.task('build', ['styles', 'js', 'fonts', 'nunjucks', 'data']);


gulp.task('default', ['serve']);
