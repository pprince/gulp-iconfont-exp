'use strict';

var gulp        = require('gulp');

var browserSync = require('browser-sync');


gulp.task('watch', ['build'], function(){
    gulp.watch('src/js/**', ['browserify']);
    gulp.watch('src/sass/**', ['compass']);
    gulp.watch('src/img/**', ['images']);
    gulp.watch('src/iconfont/**', ['compass']);
    gulp.watch(['src/content/**', '!**/*.{md,html}'], ['copy']);
    gulp.watch('src/content/**/*.{md,html}', ['content']);

    browserSync.init(['build/**'], {
        server: {
            baseDir: 'build'
        }
    });
});
