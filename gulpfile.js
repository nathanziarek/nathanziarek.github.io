var gulp = require('gulp')
    less = require('gulp-less'),
    package = require('./package.json'),
    semver = require('semver'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    bowerApp = require("bower"),
    sourcemaps = require('gulp-sourcemaps'),
    flatten = require('gulp-flatten'),
    bump = require('gulp-bump'),
    inline_base64 = require('gulp-inline-base64'),
    tinypng = require("gulp-tinypng-compress"),
    svgmin = require("gulp-svgmin"),
    svg2png = require('gulp-svg2png')
    md5 = require("gulp-md5-plus");

/* Default Tasks */
    gulp.task('default', ['build-less', 'concat-scripts', 'copy-icons1', 'copy-icons2', 'copy-bitmaps', 'copy-svg', 'copy-video'],  function() {});

    gulp.task('copy-layouts', function(cb){
      gulp.src(['source/layouts/*.html'])
        .pipe(gulp.dest('_layouts'))
        .on( "end", cb );
    });

/* Builders */
    gulp.task('build-less', ['copy-layouts'], function(cb) {
        del(['interface/**.css'], function() {
            gulp
                .src("source/styles/main.less")
                .pipe( sourcemaps.init() )
                .pipe( less() )
                .pipe(inline_base64({
                    baseDir: "source/",
                    debug: true
                }))
                .pipe( autoprefixer() )
                .pipe( sourcemaps.write() )
                .pipe( csso() )
                .pipe(md5(10, '_layouts/meta.html'))
                .pipe( gulp.dest("interface/") )
                .on("end", cb);
        });
    });
    gulp.task('concat-scripts', ['copy-layouts'], function(cb){
        del(['interface/**.js'], function() {
            var librarySources = require('bower-files')();
                librarySources.js.unshift('source/scripts/init.js');
                librarySources.js.push('source/scripts/app.js');
            gulp.src( librarySources.js )
                .pipe( sourcemaps.init() )
                .pipe( concat('main.js', {newLine: ';'} ) )
                .pipe( sourcemaps.write() )
                .pipe( uglify() )
                .pipe(md5(10, '_layouts/meta.html'))
                .pipe( gulp.dest('interface/') )
                .on( "end", cb );
        });
    });
    gulp.task('copy-icons1', function(cb){
        gulp.src(['source/icons/*.png'])
            .pipe(flatten())
              .pipe(tinypng({
                key: 'CK5W98PwRUiKlxH8klZcmQ7pCQhj8uao',
                checkSigs: true,
                sigFile: 'source/icons/.tinypng-sigs',
                log: true
            }))
            .pipe(gulp.dest('interface/'))
            .on( "end", cb );
    });
    gulp.task('copy-icons2', function(cb){
      del(['interface/*.ico'], function() {
        gulp.src(['source/icons/*.ico'])
        .pipe(flatten())
        .pipe(gulp.dest('interface/'))
        .on( "end", cb );
      });
    });
    gulp.task('copy-bitmaps', function(cb){
      gulp.src(['source/media/*.png', 'source/media/*.jpg'])
        .pipe(tinypng({
            key: 'CK5W98PwRUiKlxH8klZcmQ7pCQhj8uao',
            checkSigs: true,
            sigFile: 'source/media/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('media/'))
        .on( "end", cb );
    });
    gulp.task('copy-svg', function(cb){
      gulp.src(['source/media/*.svg'])
        .pipe(svgmin())
        .pipe(gulp.dest('media/'))
        .pipe(svg2png())
        .pipe(tinypng({
            key: 'CK5W98PwRUiKlxH8klZcmQ7pCQhj8uao',
            checkSigs: true,
            sigFile: 'source/media/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('media/'))
        .on( "end", cb );
    });
    gulp.task('copy-video', function(cb){
      gulp.src(['source/media/*.m4v'])
        .pipe(gulp.dest('media/'))
        .on( "end", cb );
    });


/* Utilities */
    gulp.task('update-packages', ['clean-packages'], function (cb) {
        bowerApp.commands.update().on("end", function() { cb() });
    });
    gulp.task('clean-packages', function (cb) {
        bowerApp.commands.prune().on("end", function() { cb() });
    });
    gulp.task('bower-software', ['update-packages'], function(cb) {
        bowerApp.commands.list().on("end", function(results){
            var docs = "# Software\n\n";
            Object.keys(results.dependencies).forEach(function (k) {
                docs += "* [" + k + "](" + results.dependencies[k].pkgMeta.homepage + "): " + results.dependencies[k].pkgMeta.version + "\n";
            });
            fs.writeFileSync("source/docs/duel-software.md", docs.trim());
            cb();
        });
    });