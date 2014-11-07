// Gulp and Gulp tooling
var gulp = require('gulp');
var gutil = require('gulp-util');
var filter = require('gulp-filter');

// LESS
var less = require('gulp-less');

// JSHint
var jshint = require('gulp-jshint');

// Traceur compiler and JS processing tools
var traceur = require('traceur');
var uglify = require('gulp-uglify');

// Sourcemap rendering and saving support (for compiled LESS and ES6)
var sourcemaps = require('gulp-sourcemaps');

// Node runner to serve the API
var nodemon = require('gulp-nodemon');

// Browser sync - responsive testing and livereload
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('default', []);

gulp.task('serve', [], function() {
  gulp.watch(['./app/less/**/*.less'], ['less']);
  gulp.watch(['./app/views/**/*.html'], ['copy:views']);
  gulp.watch(['./app/modules/**/*', '!./app/app/**/*Spec.js'], ['copy:modules']);
});

gulp.task('copy:views', function () {
  gulp.src('./app/views/**/*.html', {base: './app/views'})
    .pipe(gulp.dest('./dist/views'))
    .pipe(reload({stream: true, once: true}));
});

gulp.task('copy:modules', function() {
  gulp.src(['./app/modules/**/*', '!./app/app/**/*Spec.js'], 
      {base: './app/modules'})
    .pipe(gulp.dest('./dist/modules'));
});

gulp.task('less', function () {
  gutil.log('Regenerating LESS');
  gulp.src('./app/less/main.less')
    .pipe(sourcemaps.init())
    .pipe(less({paths: ['./app', './dist']}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(filter('**/*.css'))
    .pipe(reload({stream: true}));
});

gulp.task('lint', function() {
  gulp.src('./dist/**/*.js')
    .pipe(jshint());
});

gulp.task('sync:serve', function(done) {
  browserSync({
    server: {
      baseDir: './dist'
    },
    browser: ['google chrome']
  }, done);
});

gulp.task('sync:proxy', function(done) {
  browserSync({
    proxy: 'http://localhost:3000',
    browser: ['google chrome']
  }, done);
});

gulp.task('hard-reload', function() {
  reload({stream: true, once: true});
});

gulp.task('serve:api', function() {
  nodemon({
    script: './api/app.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    },
    nodeArgs: ['--harmony --debug']
  }).on('change', ['lint'])
    .on('restart', ['hard-reload']);
});