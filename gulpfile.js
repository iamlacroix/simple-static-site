/**
 * Modules
 */
var gulp  = require('gulp');
var gutil = require('gulp-util');

var clean = require('gulp-clean');
var jade  = require('gulp-jade');
var sass  = require('gulp-sass');
var connect    = require('gulp-connect');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');

var boardingPass = require('boarding-pass').includePaths;

/**
 * Utils
 */
var destPath = function(path) {
  path = (path && ('/' + path.replace(/^\//, ''))) || '';
  return (opts.production) ? paths.dist + path : paths.build + path;
};
var htmlPath  = function(path) { return './templates/'   + path; };
var cssPath   = function(path) { return './stylesheets/' + path; };
var jsPath    = function(path) { return './javascripts/' + path; };
var imagePath = function(path) { return './images/' + path; };
var fontPath  = function(path) { return './fonts/'  + path; };

/**
 * Settings
 */
var opts = {
  production: false
};

var paths = {
  build:  './build',
  dist:   './dist',
  html:   [htmlPath('index.jade')],
  css:    [cssPath('main.scss')],
  js:     [jsPath('main.js')],
  images: imagePath('**/*'),
  fonts:  fontPath('**/*')
};

/**
 * Tasks
 */

gulp.task('sass', function () {
  gutil.log('production =>', gutil.colors.red(opts.production));
  gulp.src(paths.css)
    .pipe(sass({
      includePaths: boardingPass
    }))
    .pipe(gulp.dest(destPath('stylesheets')))
    .pipe(livereload());
});

gulp.task('browserify', function () {
  gulp.src(paths.js)
    .pipe(browserify({
      debug: false
    }))
    .pipe(gulp.dest(destPath('javascripts')));
});

gulp.task('clean', function() {
  gulp.src(destPath('/**/*'), {read: false})
    .pipe(clean());
});

gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(gulp.dest(destPath('images')));
});

gulp.task('fonts', function() {
  gulp.src(paths.fonts)
    .pipe(gulp.dest(destPath('fonts')));
});

gulp.task('templates', function() {
  gulp.src(paths.html)
    .pipe(jade({
      pretty: !opts.production
    }))
    .pipe(gulp.dest(destPath()));
});

gulp.task('connect', connect.server({
  root: ['build'],
  port: 3000
}));

gulp.task('production', function() {
  opts.production = true;
});

gulp.task('watch', function () {
  gulp.watch(htmlPath('**/*'), ['templates']);
  gulp.watch(cssPath('**/*'), ['sass']);
  gulp.watch(jsPath('**/*'),  ['browserify']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.fonts,  ['fonts']);
});

gulp.task('build', [
  'clean',
  'sass',
  'browserify',
  'images',
  'fonts',
  'templates'
]);
gulp.task('dist', ['production', 'build']);
gulp.task('default', ['build', 'connect', 'watch']);
