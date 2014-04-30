'use strict';

var gulp         = require('gulp');

var compass      = require('gulp-compass');

var handleErrors = require('./util/handleErrors');


gulp.task('compass', ['iconfont'], function() {
    return gulp.src('src/sass/*.{sass,scss}')
        .pipe(compass({
            debug: true,
            css: 'build/css',
            sass: 'src/sass',
            require: ['susy'],
            import_path: ['build/sass']
        }));
        //.on('error', handleErrors);
});
