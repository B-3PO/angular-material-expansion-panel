var paths = require('./config').paths;

var gulp = require('gulp');
var inject = require('gulp-inject');
var mainBowerFiles = require('gulp-main-bower-files');


exports.inject = function () {
  var scripts = gulp.src(paths.scripts, {read: false});
  var css = gulp.src(paths.css, {read: false});
  var appScripts = gulp.src(paths.appScripts, {read: false});
  var appCss = gulp.src(paths.appCss, {read: false});
  var bower = gulp.src(paths.bower).pipe(mainBowerFiles());

  return gulp.src(paths.app + 'index.html')
    .pipe(inject(css, {
      name: 'css',
      relative: true,
      ignorePath: '../src'
    }))
    .pipe(inject(scripts, {
      name: 'scripts',
      relative: true,
      ignorePath: '../src'
    }))
    .pipe(inject(appCss, {
        name: 'appcss',
      relative: true,
      ignorePath: '../'
    }))
    .pipe(inject(appScripts, {
      name: 'appscripts',
      relative: true,
      ignorePath: '../'
    }))
    .pipe(inject(bower, {
      name: 'bower',
      relative: true,
      ignorePath: '../bower_components/'
    }))
    .pipe(gulp.dest(paths.dest));
};
