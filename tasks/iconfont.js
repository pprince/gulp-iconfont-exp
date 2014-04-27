'use strict';

var gulp        = require('gulp');
var gutil       = require('gulp-util');

var iconfont    = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');


gulp.task('iconfont', function() {
    return gulp.src(['src/iconfont/**/*.svg'])
        .pipe(iconfont({
            fontName: 'iconfont',
            log: function() {
                if (arguments[0].match(/^Found a line element in the icon/)) {
                    return;
                }
                gutil.log.apply(gutil, ['gulp-iconfont: '].concat(
                    [].slice.call(arguments, 0).concat()));
            }
        }))
        .on('codepoints', function(codepoints, options) {
            codepoints.forEach(function(glyph, idx, arr) {
                arr[idx].codepoint = glyph.codepoint.toString(16)
            });
            gulp.src('src/sass/templates/_iconfont.scss')
                .pipe(consolidate('swig', {
                    glyphs: codepoints
                }))
                .pipe(gulp.dest('gen/sass'))
            ;
        })
        .pipe(gulp.dest('build/fonts'))
    ;
});
