var gulp         = require('gulp');
var path         = require('path');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var nodemon      = require('gulp-nodemon');
var livereload   = require('gulp-livereload');
var plumber      = require('gulp-plumber');
var rename       = require('gulp-rename');
var jshint       = require('gulp-jshint');
var mocha        = require('gulp-mocha');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('test', function () {
  return gulp.src(['test/**/*.js'])
    .pipe(plumber())
    .pipe(mocha({ reporter:'spec' }));
});

gulp.task('scripts', function() {
  gulp.src('./build/scripts/*.js')
    .pipe(jshint())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('sass', function () {
  gulp.src('./build/scss/screen.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 2 versions']
      }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
    ext: 'html js',
    ignore: [],
    stdout: true
  })
  .on('restart', function () {
    // console.log('restarted!')
  });
});

gulp.task('watch', function () {
  gulp.watch(['./build/scss/**/*.scss'], ['sass']);
  gulp.watch(['app.js','build/scripts/**/*.js','lib/**/*.js','test/**/*.js'], ['scripts','test']);

  var server = livereload();
  gulp.watch(['public/**','views/**'])
    .on('change', function (file) {
      server.changed(file.path);
    });
});

gulp.task('default', ['sass', 'scripts', 'test', 'nodemon', 'watch']);