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
  gulp.src('./less/*.less')
    .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .on('error', errorHandler)
    .pipe(gulp.dest('./css'));
});

gulp.task('connect', function() {
    connect.server({
        root: '.'
    });
});

var watcher = gulp.watch('./less/*.less', ['less'] );

watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('default', function() { ['lint', 'less'] });

function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}
