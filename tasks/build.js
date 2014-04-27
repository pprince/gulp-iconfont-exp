'use strict';

var gulp = require('gulp');


gulp.task('build', ['content', 'browserify', 'compass', 'images', 'copy']);
