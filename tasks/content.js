'use strict';

var gulp        = require('gulp');
var gutil       = require('gulp-util');

var es          = require('event-stream');
var gulpif      = require('gulp-if');
var header      = require('gulp-header');
var pandoc      = require('gulp-pandoc');
var rename      = require('gulp-rename');
var vartree     = require('gulp-vartree');
var consolidate = require('gulp-consolidate');
var frontmatter = require('gulp-front-matter');
var handleErrors= require('./util/handleErrors');

var site = {
    title:  'Site Title Here',
    tree: {}
};


gulp.task('content', function() {

    return gulp.src(['src/content/**/*.{html,md}'])

        // Extract YAML-formatted front-matter
        // -----------------------------------
        // Markdown files  :  Keep front-matter (for Pandoc to consume later.)
        // All other files :  Remove front-matter.
        .pipe(gulpif( //if
            /\.md$/, // then:
            frontmatter({
                property: 'meta',
                remove: false
            }), // else:
            frontmatter({
                property: 'meta',
                remove: true
            })
        ))

        // Pretty URLs:
        // ------------
        // Rename /blah.html -> /blah/index.html,
        // only if noprettyurl is NOT set in the front-matter.
        .pipe(gulpif( //if
            function(file){
                return !file.meta.noprettyurl;
            }, // then:
            rename(function(path) {
                if (path.basename !== 'index') {
                    path.dirname += '/'+path.basename;
                    path.basename = 'index';
                }
            })
        ))

        // Site Tree
        // ---------
        // For building sitemap?
        // For building navigation?
        // For building index pages?
        .pipe(vartree({
            prop:       'meta',
            root:       site.tree,
            childsProp: 'children',
            pathProp:   'dirname',
            nameProp:   'basename',
            extProp:    'origext',
            hrefProp:   'href',
            folderProp: 'directory',
        }))

        // Templating
        // ----------
        // *Before* Markdown is processed.
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

        // Markdown (Pandoc)
        // -----------------
        // Process Markdown files through Pandoc.
        // This will also do rename .md -> .html
        .pipe(gulpif( //if
            /\.md$/, // then:
            pandoc({
                from: 'markdown',
                to:   'html5',
                ext:  '.html',
                args: [
                    '--smart'
                ]
            })
        ))

        // Output .html Files
        // ------------------
        .pipe(gulp.dest('gen/content'))

        // Output Site Tree
        // ----------------
        .on('end', function() {
            console.log(JSON.stringify(site.tree, null, 2));
        })
    ;
});
