var gulp       = require('gulp')
,   path       = require('path')
,   less       = require('gulp-less')
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

gulp.task('scripts', function() {
  gulp.src('./build/scripts/*.js')
    .pipe(jshint())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
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
  gulp.watch(['app.js','build/scripts/**/*.js','routes/**/*.js','test/**/*.js'], ['scripts','test']);

  var server = livereload();
  gulp.watch('public/**').on('change', function (file) {
      server.changed(file.path);
  });
});

gulp.task('default', ['less', 'scripts', 'test', 'nodemon', 'watch']);