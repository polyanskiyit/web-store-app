var gulp = require('gulp');
const uglify = require('gulp-uglifyes');
var concat = require('gulp-concat');
//var js_obfuscator = require('gulp-js-obfuscator');
//var minify = require('gulp-minify');
//var javascriptObfuscator = require('gulp-javascript-obfuscator');
//var ngmin = require('gulp-ngmin');

//var babel = require('gulp-babel');

gulp.task('default', ['compress']);

gulp.task('compress', function () {
    gulp.src('public/js/my.js')
        .pipe(concat('client.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist'))
        //        .pipe(minify())
        //    .pipe(ngmin({dynamic: true}))
        //        .pipe(gulp.dest('public/dist'))
});
 