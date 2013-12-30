module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    initData: [],
    bower: {
    	install: {
    		options: {
	    		cleanTargetDir: false,
	    	    cleanBowerDir: false,
	    	    targetDir: 'bower_components'
    	    }
    	}
    },
    uglify: {
		build: {
			files: {
				'../interface/v<%= pkg.version %>/main.js': '<%= initData %>'
			}
		}
	},
	less: {
		build: {
			files: {
				'../interface/v<%= pkg.version %>/main.css': ['styles/main.less']
		    },
		    options: {
				cleancss: true
		    }
		}
	},
	copy: {
		main: {
		    files: [
				{
					expand: true,
					cwd: 'glyphs/icomoon/',
					src: '**',
					dest: '../interface/v<%= pkg.version %>/',
					flatten: true,
					filter: 'isFile'
				}
			]
		}
	}
  });


  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');


  grunt.registerTask('default', ['bower', 'bower-builder', 'uglify:build', 'less:build', 'copy:main']);
  grunt.registerTask('bower-builder', function() {
	
	var done = this.async();
	var bowerApp = require("bower");
	var org = require("organize-bower-sources");
	
	bowerApp.commands.list().on("end", function(results){
		sources = ["scripts/init.js"];
		sources.push(org(results)['.js']);
		sources.push("scripts/app.js");
	    grunt.config(['initData'], sources);
	    done();
	});
	
  });

};