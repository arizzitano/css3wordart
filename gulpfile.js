var gulp = require('gulp');
var path = require('path');

var jshint = require('gulp-jshint');
var less = require('gulp-less');
var connect = require('gulp-connect');

gulp.task('lint', function() {
    return gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('connect', function() {
    connect.server({
        root: './public'
    });
});

gulp.task('default', function() { ['lint', 'less'] });
