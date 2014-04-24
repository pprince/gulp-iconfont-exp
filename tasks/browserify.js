var gulp         = require('gulp');
var gutil        = require('gulp-util');
var browserify   = require('browserify');
var handleErrors = require('./util/handleErrors');
var source       = require('vinyl-source-stream');

gulp.task('browserify', function(){
	return browserify({
                        basedir: process.cwd(),
			entries: ['./src/javascript/app.coffee'],
			extensions: ['.coffee', '.hbs']
		})
		.require('backbone/node_modules/underscore', { expose: 'underscore' })
		.bundle({debug: true})
		.on('error', handleErrors)
		.pipe(source('app.js'))
		.pipe(gulp.dest('build'));
});
