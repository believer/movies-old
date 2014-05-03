module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      development: {
        options: {
          paths: ["build/less"]
        },
        files: {
          'public/css/vendor.css': [
            'bower_components/bootstrap/less/bootstrap.less',
            'bower_components/ionicons/css/ionicons.css'
          ]
        }
      }
    },

    stylus: {
      compile: {
        files: {
          'public/css/<%= pkg.name %>.css': [
            'build/styl/*.styl'
          ]
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['build/scripts/*.js'],
        dest: 'public/js/<%= pkg.name %>.js',
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      beforeconcat: ['build/scripts/*.js', 'routes/*.js']
    },

    watch: {
      options: {
        livereload: true
      },
      clear: {
        //clear terminal on any watch task. beauty.
        files: ['build/**/*'], //or be more specific
        tasks: ['clear']
      },
      scripts: {
        files: ['build/scripts/*.js', 'routes/*.js'],
        tasks: ['jshint', 'concat']
      },
      styl: {
        files: ['build/styl/*.styl'],
        tasks: ['stylus']
      },
      another: {
        files: ['views/*.html','public/partials/*.html']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-clear');

  // Default task(s).
  grunt.registerTask('default', ['clear', 'jshint', 'less', 'stylus', 'concat', 'watch']);

};