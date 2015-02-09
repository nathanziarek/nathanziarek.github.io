var gulp = require('gulp')
    less = require('gulp-less'),
    gulpFilter = require('gulp-filter'),
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
    imagemin = require('gulp-imagemin'),
    flatten = require('gulp-flatten'),
    bump = require('gulp-bump');

/* Default Tasks */
    gulp.task('default', ['build-less', 'concat-scripts', 'copy-glyphs', 'copy-icons'],  function() {});

/* Builders */
    gulp.task('build-less', ['clean-build', 'update-packages'], function(cb) {
        gulp
            .src("source/styles/*.less")
            .pipe( sourcemaps.init() )
            .pipe( less() )
            .pipe( autoprefixer() )
            .pipe( sourcemaps.write() )
            .pipe( gulp.dest("interface/") )
            .on("end", cb)
    });
    gulp.task('concat-scripts', ['clean-build', 'update-packages'], function(cb){
        var librarySources = require('bower-files')();
            librarySources.js.unshift('source/scripts/init.js');
            librarySources.js.push('source/scripts/app.js');
        gulp.src( librarySources.js )
            .pipe( sourcemaps.init() )
            .pipe( concat('main.js', {newLine: ';'} ) )
            .pipe( sourcemaps.write() )
            .pipe( gulp.dest('interface/') )
            .on( "end", cb );
    });
    gulp.task('copy-glyphs', ['clean-build'], function(cb){
      gulp.src(['source/glyphs/**/*.svg', 'source/glyphs/**/*.ttf', 'source/glyphs/**/*.woff', 'source/glyphs/**/*.eot'])
        .pipe(flatten())
        .pipe(gulp.dest('interface'))
        .on( "end", cb );
    });
    gulp.task('copy-icons', ['clean-build'], function(cb){
      gulp.src(['source/icons/*.png', 'source/icons/*.ico'])
        .pipe(flatten())
        .pipe(gulp.dest('interface/'))
        .on( "end", cb );
    });

/* Cleaners */
    gulp.task('clean-build', function (cb) {
        del(['interface/**'], function () { cb(); });
    });


/* Filters */
    var filterCSS = gulpFilter(["**/*.css"]);
    var filterJS = gulpFilter(["**/*.js"]);
    var filterImg = gulpFilter(["**/*.png"]);

    gulp.task('crush', ['default'],  function() {
        gulp.src('interface/*.*')

            .pipe(filterCSS)
            .pipe(csso())
            .pipe(filterCSS.restore())

            .pipe(filterJS)
            .pipe(uglify())
            .pipe(filterJS.restore())

            .pipe(filterImg)
            .pipe(imagemin())
            .pipe(filterImg.restore())

            .pipe(gulp.dest('interface/'))
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
