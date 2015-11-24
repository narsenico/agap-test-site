// TODO: copiare librerie js da bower_components a public/js
var gulp = require('gulp');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
//
var dstJs = 'public/js';
var srcJs = [
	['bower_components/jquery/dist/jquery.js', 'jquery.js'],
    ['bower_components/jquery/dist/jquery.min.js', 'jquery.min.js'],
    ['bower_components/jquery/dist/jquery.min.map', 'jquery.min.map']
];

gulp.task('copy-js', function() {
    srcJs.forEach(function(item) {
        gulp.src(item[0])
            .pipe(rename(item[1]))
            .pipe(debug({
                title: 'copy -> '
            }))
            .pipe(gulp.dest(dstJs));
    });
});

gulp.task('default', ['copy-js'], function() {});
