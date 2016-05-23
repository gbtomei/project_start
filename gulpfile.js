var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    jade        = require('gulp-jade'),
    plumber     = require('gulp-plumber'),
    concat      = require('gulp-concat'),
    browserSync = require('browser-sync'),
    useref      = require('gulp-useref'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    minifyCss   = require('gulp-minify-css'),
    wiredep     = require('wiredep').stream,
    reload      = browserSync.reload;


gulp.task('serve', ['sass', 'jade'], function() {

  browserSync({

    server: { baseDir: "./app/" }

  });


  gulp.watch("app/scss/**/*.scss", ['sass']);
  gulp.watch("app/jade/**/*.jade", ['jade']);
  gulp.watch("app/js/*.js",     ['js']);

});

/* DEV TASKS */

gulp.task('sass', function () {

    gulp.src('./app/scss/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./app/css'))
        .pipe(reload({stream: true})
    );
});

gulp.task('jade', function () {
    gulp.src('./app/jade/pages/*.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./app/'))
        .pipe(reload({stream: true}));
});

gulp.task('js', function () {
    gulp.src('./app/js/modules/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./app/js/'))
        .pipe(reload({stream: true}));
});

gulp.task('wiredep', function () {
    gulp.src('./app/jade/*.jade')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('./app/jade/'));
});

/* END OF DEV TASKS */

/* BUILD TASKS */

gulp.task('dist', function () {
    var assets = useref.assets();
    gulp.src('./app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./dist/'));
});

/* END OF BUILD TASKS */

gulp.task('default', ['serve']);
