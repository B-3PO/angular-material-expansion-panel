var paths = require('./config').paths;

var gulp = require('gulp');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var gulpFilter = require('gulp-filter');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');

exports.getDev = function (srcs) {
  srcs = srcs || paths.css.concat(paths.appCss);

  return function dev() {
    return gulp.src(srcs)
      .pipe(autoprefixer())
      .pipe(gulp.dest(paths.dest))
      .on('end', function(){
        gutil.log(gutil.colors.green('✔ CSS dev'), 'Finished');
      });
  };
};



exports.release = function () {
  return gulp.src(paths.css)
    .pipe(concat())
    .pipe(autoprefixer())
    .pipe(rename('md-expansion-panel.css'))
    .pipe(gulp.dest(paths.build))
    .pipe(cssnano())
    .pipe(rename('md-expansion-panel.min.css'))
    .pipe(gulp.dest(paths.build))
    .on('end', function(){
      gutil.log(gutil.colors.green('✔ CSS Build'), 'Finished');
    });
};
