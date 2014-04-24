var gulp        = require('gulp');
var gutil       = require('gulp-util');

var es = require('event-stream');
var pandoc      = require('gulp-pandoc');
var frontmatter = require('gulp-front-matter');
var ssg         = require('gulp-ssg');
var header      = require('gulp-header');
var consolidate = require('gulp-consolidate');


var site = {
    title:  'Site title here'
};


gulp.task('content', function() {

    return gulp.src(['src/content/**/*.md'])

        .pipe(frontmatter({
            property: 'meta',
            remove: false
        }))

        .pipe(consolidate(
            'swig',
            function(file) {
                return {
                    site: site,
                    page: file.meta
                };
            },
            {
                useContents: true
            }
        ))

        .pipe(ssg(site))

        .pipe(pandoc({
            from: 'markdown',
            to:   'html5',
            ext:  '.html',
            args: [
                '--smart'
            ]
        }))

        .pipe(gulp.dest('gen/content'))
    ;
});
