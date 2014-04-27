'use strict';

var gulp = require('gulp');


gulp.task('copy', function() {
    return gulp.src(['src/content/**', '!**/*.md', '!**/*.html'])
        .pipe(gulp.dest('build'));
});
