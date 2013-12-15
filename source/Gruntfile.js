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
	var jsSources = [];
	bowerApp.commands.list({paths:true}).on("end", function(results){
	    for(key in results) {
	    	if(typeof(results[key]) == "string") {
	    		jsSources.push(results[key]);
			} else {
				for(i=0; i<results[key].length; i++) {
					jsSources.push(results[key][i]);
				}
			}
	    }
	    grunt.config(['initData'], jsSources);
	    done();
	});
	
  });

};