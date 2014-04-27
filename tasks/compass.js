'use strict';

var gulp         = require('gulp');

var compass      = require('gulp-compass');

var handleErrors = require('./util/handleErrors');


gulp.task('compass', ['iconfont'], function() {
    return gulp.src('src/sass/*.sass')
        .pipe(compass({
            config_file: 'compass.rb',
            css: 'build/css',
            sass: 'src/sass',
            require: ['susy', 'bootstrap']
        }))
        .on('error', handleErrors);
});
