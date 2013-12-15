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
				'../interface/main.js': '<%= initData %>'
			}
		}
	},
	less: {
		build: {
			files: {
				'../interface/main.css': ['styles/main.less']
		    }
		}
	}
	
  });


  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');


  grunt.registerTask('default', ['bower', 'bower-builder', 'uglify:build', 'less:build']);
  grunt.registerTask('bower-builder', function() {
	
	var done = this.async();
	var bowerApp = require("bower");
	var org = require("organize-bower-sources");
	
	bowerApp.commands.list().on("end", function(results){
	    grunt.config(['initData'], org(results)['.js']);
	    done();
	});
	
  });

};