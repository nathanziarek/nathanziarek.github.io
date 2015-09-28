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
    tinypng = require("gulp-tinypng-compress");

/* Default Tasks */
    gulp.task('default', ['build-less', 'concat-scripts', 'copy-icons1', 'copy-icons2', 'copy-images', 'copy-video'],  function() {});

/* Builders */
    gulp.task('build-less', function(cb) {
        del(['interface/**.css'], function() {
            gulp
                .src("source/styles/*.less")
                .pipe( sourcemaps.init() )
                .pipe( less() )
                .pipe(inline_base64({
                    baseDir: "source/",
                    debug: true
                }))
                .pipe( autoprefixer() )
                .pipe( sourcemaps.write() )
                .pipe( csso() )
                .pipe( gulp.dest("interface/") )
                .on("end", cb);
        });
    });
    gulp.task('concat-scripts', function(cb){
        del(['interface/**.js'], function() {
            var librarySources = require('bower-files')();
                librarySources.js.unshift('source/scripts/init.js');
                librarySources.js.push('source/scripts/app.js');
            gulp.src( librarySources.js )
                .pipe( sourcemaps.init() )
                .pipe( concat('main.js', {newLine: ';'} ) )
                .pipe( sourcemaps.write() )
                .pipe( uglify() )
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
                sigFile: '_objects/.tinypng-sigs',
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
    gulp.task('copy-images', function(cb){
      gulp.src(['_objects/*.png', '_objects/*.jpg'])
        .pipe(tinypng({
            key: 'CK5W98PwRUiKlxH8klZcmQ7pCQhj8uao',
            checkSigs: true,
            sigFile: '_objects/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('media/'))
        .on( "end", cb );
    });
    gulp.task('copy-video', function(cb){
      gulp.src(['_objects/*.m4v'])
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


/* Changelog */
    var newVersion = "";
    gulp.task('increment-version', function(cb) {
        newVersion = semver.inc(package.version, "minor");
        gulp.src(['package.json', 'bower.json'])
            .pipe(bump({ version: newVersion }))
            .pipe(gulp.dest('./'))
    });
