var paths = require('./gulp/config').paths;

var gulp = require('gulp');
var serve = require('gulp-serve');
var gulpSequence = require('gulp-sequence');
var del = require('del');


var jsBuild = require('./gulp/jsBuild');
var cssBuild = require('./gulp/cssBuild');
var indexBuild = require('./gulp/indexBuild');



gulp.task('jsBuild', jsBuild.getDev());
gulp.task('cssBuild', cssBuild.getDev());
gulp.task('indexBuild', indexBuild.inject);



// -- main tasks. use these to watch and build and release

gulp.task('default', gulpSequence('buildLocal', ['serve', 'watch']));
gulp.task('buildLocal', gulpSequence(
  'clean',
  [
    'jsBuild',
    'cssBuild',
    'copyPartials'
  ],
  'indexBuild'
));



gulp.task('clean', function () {
  return del(paths.dest);
});


gulp.task('copyPartials', function () {
  return gulp.src(paths.partials, {base: paths.app})
    .pipe(gulp.dest(paths.dest));
});

gulp.task('serve', serve({
  root: ['public', 'bower_components'],
  port: 8080
}));





gulp.task('watch', function () {
  gulp.watch(paths.scripts.concat(paths.appScripts), function (event) {
    jsBuild.getDev(event.path)()
      .on('end', function () {
        if (event.type !== 'changed') { indexBuild.inject(); }
      });
  });


  gulp.watch(paths.css.concat(paths.appCss), function (event) {
    cssBuild.getDev(event.path)()
      .on('end', function () {
        if (event.type !== 'changed') { indexBuild.inject(); }
      });
  });


  gulp.watch(paths.partials, function (event) {
    return gulp.src(event.path, {base: paths.app})
      .pipe(gulp.dest(paths.dest));
  });
});
