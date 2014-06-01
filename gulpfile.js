var gulp       = require('gulp')
,   path       = require('path')
,   less       = require('gulp-less')
,   nodemon    = require('gulp-nodemon')
,   livereload = require('gulp-livereload')
,   plumber    = require('gulp-plumber')
,   rename     = require('gulp-rename')
,   jshint     = require('gulp-jshint')
,   mocha      = require('gulp-mocha');

var config = {
  styles: 'build/styl/**/',
  stylesOut: 'public/css/',
  allStyle: '*.less',
  mainStyle: 'main.less'
}

gulp.task('test', function (cb) {
  return gulp.src(['app.js', 'routes/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .on('end', function () {
      gulp.src(['test/**/*.js'])
        .pipe(plumber())  
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(mocha({reporter: 'Spec'}))
        .on('end', cb);
    });
});

gulp.task('less', function () {
  gulp.src(config.styles + config.mainStyle)
    .pipe(plumber())
    .pipe(less({
      compress: true
    }))
    .pipe(rename('movies.css'))
    .pipe(gulp.dest(config.stylesOut));
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
    ext: 'html js',
    ignore: [],
    stdout: true,
    nodeArgs: ['--debug']
  })
  .on('restart', function () {
    // console.log('restarted!')
  })
})

gulp.task('watch', function () {
  gulp.watch([config.styles + config.allStyle], ['less']);
  gulp.watch(['app.js','build/scripts/**/*.js','routes/**/*.js','test/**/*.js'], ['test']);

  var server = livereload();
  gulp.watch('public/**').on('change', function (file) {
      server.changed(file.path);
  });
});

gulp.task('default', ['less', 'test', 'nodemon', 'watch']);