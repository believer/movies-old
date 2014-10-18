var gulp       = require('gulp')
,   path       = require('path')
,   sass       = require('gulp-sass')
,   sourcemaps = require('gulp-sourcemaps')
,   nodemon    = require('gulp-nodemon')
,   livereload = require('gulp-livereload')
,   plumber    = require('gulp-plumber')
,   rename     = require('gulp-rename')
,   jshint     = require('gulp-jshint')
,   mocha      = require('gulp-mocha')
,   concat     = require('gulp-concat')
,   uglify     = require('gulp-uglify');


var config = {
  styles: 'build/less/**/',
  stylesOut: 'public/css/',
  allStyle: '*.less',
  mainStyle: 'main.less'
}

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
  gulp.src('./build/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass())
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
  gulp.watch('public/**').on('change', function (file) {
      server.changed(file.path);
  });
});

gulp.task('default', ['sass', 'scripts', 'test', 'nodemon', 'watch']);