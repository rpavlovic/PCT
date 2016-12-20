'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    flatten = require('gulp-flatten'),
    del = require('del');

// paths
var sassSrc = 'src/sass/**/*.scss',
    sassDest = 'build/css',
    jsSrc = 'src/js/components/*.js',
    jsDest = 'build/js',
    htmlSrc = 'src/templates/**/*.njk',
    htmlDest = 'build/templates',
    imgSrc = 'src/images/**',
    imgDest = 'build/images',
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
    .pipe(sourcemaps.init())
    .pipe(uglify()
      .on('error', function(e) {
         console.log(e);
         this.emit('end');
      })
    )
    .pipe(flatten())
    .pipe(concat('base.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(jsDest));
});

function getDataForFile(file) {
  console.log(file.relative);
  return {
    example: 'data loaded for ' + file.relative
  };
}

gulp.task('nunjucks', function () {
  // Gets .html and .nunjucks files in pages
 return gulp.src('src/templates/**/*.+(html|njk)')
    .pipe(data(getDataForFile))
    // Renders template with nunjucks
    .pipe(nunjucksRender(defaults))
    .on('error', function(e) {
       console.log(e);
       this.emit('end');
    })
    // .pipe(data(function() {
    //      return require('./src/data/gw_client_data.json')
    //    }))
    // output files in app folder
    .pipe(gulp.dest('build/templates'));
    // .pipe(browserSync.stream({once: true}));
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

// add image minify task
gulp.task('imagemin', function () {
  return gulp.src(imgSrc)
    .pipe(newer(imgSrc))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDest));
});

// gulp.task('move', function(){
//   // the base option sets the relative root for the set of files,
//   // preserving the folder structure
//   gulp.src(filesToMove, { base: './' })
//   .pipe(gulp.dest('dist'));
// });

//browser synk and scss,js and nunjucks watch
gulp.task('serve', ['styles', 'js-watch'], function() {
    browserSync.init( ["/css/*.css", "/js/*.js"], {
      server: {
          baseDir: "./build",
          index: "index.html"
      }
    });
    gulp.watch(sassSrc,['styles']);
    gulp.watch(jsSrc, ['js']);
    gulp.watch(imgSrc, ['imagemin']);
    gulp.watch(htmlSrc, ['nunjucks']).on('change', browserSync.reload);
});

//Remove build folder before runing build task
gulp.task('clean-all', function () {
  return del([
    // here we use a globbing pattern to match everything inside the `build` folder
    'build/**/*',
    'build/',
    'node_modules/'
  ]);
});
var filesToMove = [
  '/src/templates/pages/index.html',
];

var jsLibToMove = [
  'src/js/assets/jquery-3.1.1.min.js',
  'src/js/assets/jquery-ui.min.js',
  'src/js/assets/DataTables-1.10.13/media/js/jquery.dataTables.min.js',
  'src/js/assets/DataTables-1.10.13/extensions/Select/js/dataTables.select.min.js',
  'src/js/assets/DataTables-1.10.13/extensions/Buttons/js/dataTables.buttons.min.js',
  'src/js/assets/DataTables-1.10.13/extensions/Buttons/js/buttons.print.min.js',
  'src/js/assets/DataTables-1.10.13/extensions/Buttons/js/buttons.html5.min.js',
  'src/js/assets/DataTables-1.10.13/extensions/AutoFill/js/dataTables.autoFill.min.js',
  'src/js/assets/altEditor.js',
  'src/js/assets/vfs_fonts.js',
  'src/js/assets/pdfmake.min.js',
  'src/js/assets/jszip.min.js',
  'src/js/assets/aa_jquery-3.1.1.min.js',
  'src/js/assets/ab_jquery-ui.min.js'
];

gulp.task('move', function() {
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src("build/templates/pages/index.html")
  .pipe(gulp.dest('build/'));
});

gulp.task('moveJS', function() {
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(jsLibToMove)
  .pipe(gulp.dest('build/js/'));
});


// Build
gulp.task('build', ['data', 'nunjucks', 'move', 'moveJS', 'styles', 'js',  'fonts', 'imagemin']);


gulp.task('default', ['serve']);

