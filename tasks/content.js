'use strict';

var gulp        = require('gulp');
var gutil       = require('gulp-util');

var es          = require('event-stream');
var tap         = require('gulp-tap');
var gulpif      = require('gulp-if');
var spawn       = require('gulp-spawn');
var header      = require('gulp-header');
var rename      = require('gulp-rename');
var vartree     = require('gulp-vartree');
var consolidate = require('gulp-consolidate');
var frontmatter = require('gulp-front-matter');
var swig        = require('swig');
var Nunjucks    = require('nunjucks');
var Filter      = require('gulp-filter');

var site = {
    title:  'Site Title Here',
    tree: {}
};


gulp.task('content', function() {
    
    swig.setDefaults({ autoescape: false });

    var markdownFilter = Filter('**/*.md');
    var nunjucks = Nunjucks;

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

        // Pretty URLs, Part 1 of 2
        // ------------------------
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
            index:      'index'
        }))

        // Pretty URLs, Part 2 of 2
        // ------------------------
        .pipe(tap(function(file, t){
            if (file.meta.href) {
                file.meta.href = file.meta.href.replace(/\/index\.(md|html)$/, '/');
                file.meta.href = file.meta.href.replace(/\.md$/, '.html');
            }
            return t;
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
        .pipe(markdownFilter)
        .pipe(spawn({
            cmd: '/usr/bin/pandoc',
            args: [
                '-f', 'markdown',
                '-t', 'html5',
                '--smart'
            ]
        }))
        .pipe(markdownFilter.restore())

        // Rename -> .html
        // ---------------
        .pipe(rename({
            extname: ".html"
        }))

        // Layout Templating
        // -----------------
        // *After* Markdown is processed.
        .pipe(tap(function(file, t){
            if (typeof file.meta.layout != 'undefined') {
                var template = process.cwd() + '/src/layouts/' + file.meta.layout + '.html';
                file.contents = new Buffer(swig.renderFile(template, {
                    site: site,
                    page: file.meta,
                    content: file.contents.toString('utf-8')
                }));
            }
        }))

        // Output .html Files
        // ------------------
        .pipe(gulp.dest('build'))

        // Output Site Tree
        // ----------------
        .on('end', function() {
            console.log(JSON.stringify(site.tree, null, 2));
        })
    ;
});
