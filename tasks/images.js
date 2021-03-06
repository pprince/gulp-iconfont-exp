'use strict';

var gulp       = require('gulp');

var changed    = require('gulp-changed');
var imagemin   = require('gulp-imagemin');


gulp.task('images', function() {
    var dest = 'build/img';

    return gulp.src('src/img/**')
        .pipe(changed(dest)) // Ignore unchanged files
        .pipe(imagemin()) // Optimize
        .pipe(gulp.dest(dest));
});
