gulp    = require('gulp');

w3cjs   = require('gulp-w3cjs');


gulp.task('validate', ['build'], function() {
    return gulp.src('build/**/*.html')
        .pipe(w3cjs())
    ;
});
